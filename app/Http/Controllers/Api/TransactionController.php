<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard()
    {
        try {
            // Count new requests (pending status)
            $newRequests = DB::table('requests')
                ->where('status', 'pending')
                ->count();

            // Count current holders (completed transactions)
            $currentHolders = DB::table('transactions')
                ->where('status', 'completed')
                ->count();

            // Count verify returns (overdue transactions)
            $verifyReturns = DB::table('transactions')
                ->where('status', 'overdue')
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'new_requests' => $newRequests,
                    'current_holders' => $currentHolders,
                    'verify_returns' => $verifyReturns
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $transactions = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'users.position',
                    'equipment.name as equipment_name',
                    'equipment.brand as category'
                )
                ->orderBy('transactions.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $transactions,
                'count' => $transactions->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'user_id' => 'required|exists:users,id',
                'equipment_id' => 'required|exists:equipment,id',
                'transaction_number' => 'required|string|unique:transactions,transaction_number',
                'request_mode' => 'required|in:work_from_home,onsite',
                'expected_return_date' => 'required|date',
                'status' => 'sometimes|in:pending,released,returned,verified',
            ]);

            $validatedData['status'] = $validatedData['status'] ?? 'pending';
            $validatedData['created_at'] = now();
            $validatedData['updated_at'] = now();

            $transactionId = DB::table('transactions')->insertGetId($validatedData);

            $transaction = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->where('transactions.id', $transactionId)
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'equipment.name as equipment_name'
                )
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $transaction = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'users.position',
                    'equipment.name as equipment_name',
                    'equipment.brand as category'
                )
                ->first();

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $transaction = DB::table('transactions')->where('id', $id)->first();
            
            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            $validatedData = $request->validate([
                'status' => 'sometimes|in:pending,released,returned,verified',
                'expected_return_date' => 'sometimes|date',
                'return_date' => 'sometimes|date',
                'return_condition' => 'sometimes|string',
                'notes' => 'sometimes|string',
            ]);

            $validatedData['updated_at'] = now();

            DB::table('transactions')->where('id', $id)->update($validatedData);

            $updatedTransaction = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'equipment.name as equipment_name'
                )
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'data' => $updatedTransaction
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $transaction = DB::table('transactions')->where('id', $id)->first();
            
            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            DB::table('transactions')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Transaction deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Release a transaction (change status to released)
     */
    public function release(Request $request, string $id)
    {
        try {
            $transaction = DB::table('transactions')->where('id', $id)->first();
            
            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            if ($transaction->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction is already released'
                ], 400);
            }

            $validatedData = $request->validate([
                'notes' => 'sometimes|string|max:500',
                'condition_on_issue' => 'sometimes|string|max:255',
            ]);

            $updateData = [
                'status' => 'completed',
                'issued_at' => now(),
                'updated_at' => now(),
            ];

            if (isset($validatedData['notes'])) {
                $updateData['notes'] = $validatedData['notes'];
            }

            if (isset($validatedData['condition_on_issue'])) {
                $updateData['condition_on_issue'] = $validatedData['condition_on_issue'];
            }

            DB::table('transactions')->where('id', $id)->update($updateData);

            $updatedTransaction = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'users.position',
                    'equipment.name as equipment_name',
                    'equipment.brand as category'
                )
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Transaction released successfully',
                'data' => $updatedTransaction
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error releasing transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate printable receipt for transaction
     */
    public function print(string $id)
    {
        try {
            $transaction = DB::table('transactions')
                ->join('users', 'transactions.user_id', '=', 'users.id')
                ->join('equipment', 'transactions.equipment_id', '=', 'equipment.id')
                ->leftJoin('users as approved_by_user', 'transactions.processed_by', '=', 'approved_by_user.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'users.name as full_name',
                    'users.position',
                    'users.email',
                    'equipment.name as equipment_name',
                    'equipment.brand as category',
                    'equipment.serial_number',
                    'equipment.model',
                    'approved_by_user.name as approved_by_name'
                )
                ->first();

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            // Generate transaction number if not exists
            if (!$transaction->transaction_number) {
                $transactionNumber = 'TXN-' . str_pad($id, 6, '0', STR_PAD_LEFT);
                DB::table('transactions')->where('id', $id)->update(['transaction_number' => $transactionNumber]);
                $transaction->transaction_number = $transactionNumber;
            }

            return response()->json([
                'success' => true,
                'data' => $transaction
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating print data: ' . $e->getMessage()
            ], 500);
        }
    }
}
