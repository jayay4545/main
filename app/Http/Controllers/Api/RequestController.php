<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as EquipmentRequest;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EquipmentRequest::with(['user', 'equipment.category', 'approver']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by equipment
        if ($request->has('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }

        // Filter by request type
        if ($request->has('request_type')) {
            $query->where('request_type', $request->request_type);
        }

        // Filter by request mode
        if ($request->has('request_mode')) {
            $query->where('request_mode', $request->request_mode);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $requests = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $requests,
            'message' => 'Requests retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'equipment_id' => 'required|exists:equipment,id',
                'request_type' => 'required|in:borrow,permanent_assignment,maintenance',
                'request_mode' => 'required|in:onsite,wfh,hybrid',
                'reason' => 'nullable|string',
                'start_date' => 'nullable|date|after_or_equal:today',
                'end_date' => 'nullable|date|after:start_date',
            ]);

            // Check if equipment is available
            $equipment = Equipment::findOrFail($validated['equipment_id']);
            if ($equipment->status !== 'available') {
                return response()->json([
                    'success' => false,
                    'message' => 'Equipment is not available for request'
                ], 422);
            }

            // Check if user already has a pending request for this equipment
            $existingRequest = EquipmentRequest::where('user_id', Auth::id())
                                              ->where('equipment_id', $validated['equipment_id'])
                                              ->where('status', 'pending')
                                              ->exists();

            if ($existingRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have a pending request for this equipment'
                ], 422);
            }

            $validated['user_id'] = Auth::id();
            $validated['status'] = 'pending';

            $equipmentRequest = EquipmentRequest::create($validated);
            $equipmentRequest->load(['user', 'equipment.category']);

            return response()->json([
                'success' => true,
                'data' => $equipmentRequest,
                'message' => 'Request created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $equipmentRequest = EquipmentRequest::with(['user', 'equipment.category', 'approver', 'transaction'])
                                          ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $equipmentRequest,
            'message' => 'Request retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $equipmentRequest = EquipmentRequest::findOrFail($id);

            // Only allow updates to pending requests
            if ($equipmentRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending requests can be updated'
                ], 422);
            }

            $validated = $request->validate([
                'request_type' => 'sometimes|required|in:borrow,permanent_assignment,maintenance',
                'request_mode' => 'sometimes|required|in:onsite,wfh,hybrid',
                'reason' => 'nullable|string',
                'start_date' => 'nullable|date|after_or_equal:today',
                'end_date' => 'nullable|date|after:start_date',
            ]);

            $equipmentRequest->update($validated);
            $equipmentRequest->load(['user', 'equipment.category']);

            return response()->json([
                'success' => true,
                'data' => $equipmentRequest,
                'message' => 'Request updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $equipmentRequest = EquipmentRequest::findOrFail($id);

        // Only allow deletion of pending requests
        if ($equipmentRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requests can be deleted'
            ], 422);
        }

        $equipmentRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Request deleted successfully'
        ]);
    }

    /**
     * Approve a request
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        try {
            $equipmentRequest = EquipmentRequest::findOrFail($id);

            if ($equipmentRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending requests can be approved'
                ], 422);
            }

            $validated = $request->validate([
                'approval_notes' => 'nullable|string',
            ]);

            DB::transaction(function () use ($equipmentRequest, $validated) {
                // Update request status
                $equipmentRequest->update([
                    'status' => 'approved',
                    'approved_by' => Auth::id(),
                    'approved_at' => now(),
                    'approval_notes' => $validated['approval_notes'] ?? null,
                ]);

                // Update equipment status
                $equipmentRequest->equipment->update(['status' => 'in_use']);

                // Create transaction record
                $equipmentRequest->transaction()->create([
                    'equipment_id' => $equipmentRequest->equipment_id,
                    'user_id' => $equipmentRequest->user_id,
                    'transaction_type' => 'issue',
                    'status' => 'active',
                    'issued_at' => now(),
                    'expected_return_date' => $equipmentRequest->end_date,
                    'condition_on_issue' => $equipmentRequest->equipment->condition,
                    'processed_by' => Auth::id(),
                ]);
            });

            $equipmentRequest->load(['user', 'equipment.category', 'approver', 'transaction']);

            return response()->json([
                'success' => true,
                'data' => $equipmentRequest,
                'message' => 'Request approved successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Reject a request
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        try {
            $equipmentRequest = EquipmentRequest::findOrFail($id);

            if ($equipmentRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending requests can be rejected'
                ], 422);
            }

            $validated = $request->validate([
                'rejection_reason' => 'required|string',
            ]);

            $equipmentRequest->update([
                'status' => 'rejected',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
                'rejection_reason' => $validated['rejection_reason'],
            ]);

            $equipmentRequest->load(['user', 'equipment.category', 'approver']);

            return response()->json([
                'success' => true,
                'data' => $equipmentRequest,
                'message' => 'Request rejected successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Get request statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => EquipmentRequest::count(),
            'pending' => EquipmentRequest::where('status', 'pending')->count(),
            'approved' => EquipmentRequest::where('status', 'approved')->count(),
            'rejected' => EquipmentRequest::where('status', 'rejected')->count(),
            'cancelled' => EquipmentRequest::where('status', 'cancelled')->count(),
            'by_type' => EquipmentRequest::selectRaw('request_type, COUNT(*) as count')
                                        ->groupBy('request_type')
                                        ->pluck('count', 'request_type'),
            'by_mode' => EquipmentRequest::selectRaw('request_mode, COUNT(*) as count')
                                        ->groupBy('request_mode')
                                        ->pluck('count', 'request_mode'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Request statistics retrieved successfully'
        ]);
    }
}
