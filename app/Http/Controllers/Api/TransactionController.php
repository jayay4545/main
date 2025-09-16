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

            // Count current holders (released transactions)
            $currentHolders = DB::table('transactions')
                ->where('status', 'released')
                ->count();

            // Count verify returns (returned transactions)
            $verifyReturns = DB::table('transactions')
                ->where('status', 'returned')
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
            // Use left joins and coalesce to avoid hard failures if related tables/columns differ
            $transactions = DB::table('transactions')
                ->leftJoin('employees', 'transactions.employee_id', '=', 'employees.id')
                ->leftJoin('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->leftJoin('equipment_categories', 'equipments.category_id', '=', 'equipment_categories.id')
                ->select(
                    'transactions.*',
                    DB::raw("COALESCE(employees.first_name, '') as first_name"),
                    DB::raw("COALESCE(employees.last_name, '') as last_name"),
                    DB::raw("COALESCE(employees.position, '') as position"),
                    DB::raw("COALESCE(equipments.name, '') as equipment_name"),
                    DB::raw("COALESCE(equipments.brand, '') as brand"),
                    DB::raw("COALESCE(equipments.model, '') as model"),
                    DB::raw("COALESCE(equipment_categories.name, '') as category_name")
                )
                ->orderBy('transactions.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $transactions,
                'count' => $transactions->count()
            ]);
        } catch (\Exception $e) {
            // Fallback: return bare transactions to keep UI working
            try {
                $fallback = DB::table('transactions')->orderBy('created_at', 'desc')->get();
                return response()->json([
                    'success' => true,
                    'data' => $fallback,
                    'count' => $fallback->count(),
                    'warning' => 'Returned minimal transaction data due to join error',
                ]);
            } catch (\Exception $inner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error fetching transactions: ' . $e->getMessage()
                ], 500);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'employee_id' => 'required|exists:employees,id',
                'equipment_id' => 'required|exists:equipments,id',
                'transaction_number' => 'required|string|unique:transactions,transaction_number',
                'request_mode' => 'required|in:work_from_home,on_site',
                'expected_return_date' => 'required|date',
                'status' => 'sometimes|in:pending,released,returned,lost,damaged',
            ]);

            $validatedData['status'] = $validatedData['status'] ?? 'pending';
            $validatedData['created_at'] = now();
            $validatedData['updated_at'] = now();

            $transactionId = DB::table('transactions')->insertGetId($validatedData);

            $transaction = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->where('transactions.id', $transactionId)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'equipments.name as equipment_name'
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
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->leftJoin('equipment_categories', 'equipments.category_id', '=', 'equipment_categories.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.brand',
                    'equipments.model',
                    'equipment_categories.name as category_name'
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
                'status' => 'sometimes|in:pending,released,returned,lost,damaged',
                'expected_return_date' => 'sometimes|date',
                'return_date' => 'sometimes|date',
                'release_date' => 'sometimes|date',
                'return_condition' => 'sometimes|in:good_condition,brand_new,damaged',
                'release_condition' => 'sometimes|in:good_condition,brand_new,damaged',
                'release_notes' => 'sometimes|string',
                'return_notes' => 'sometimes|string',
                'received_by' => 'sometimes|nullable|exists:users,id',
                'released_by' => 'sometimes|nullable|exists:users,id',
            ]);

            $validatedData['updated_at'] = now();

            DB::table('transactions')->where('id', $id)->update($validatedData);

            $updatedTransaction = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'equipments.name as equipment_name'
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

            if ($transaction->status === 'released') {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction is already released'
                ], 400);
            }

            $validatedData = $request->validate([
                'release_notes' => 'sometimes|string|max:500',
                'release_condition' => 'sometimes|in:good_condition,brand_new,damaged',
                'released_by' => 'required|exists:users,id',
                'release_date' => 'sometimes|date',
            ]);

            $updateData = [
                'status' => 'released',
                'release_date' => $validatedData['release_date'] ?? now()->toDateString(),
                'updated_at' => now(),
            ];

            if (isset($validatedData['release_notes'])) {
                $updateData['release_notes'] = $validatedData['release_notes'];
            }

            if (isset($validatedData['release_condition'])) {
                $updateData['release_condition'] = $validatedData['release_condition'];
            }

            $updateData['released_by'] = $validatedData['released_by'];

            DB::table('transactions')->where('id', $id)->update($updateData);

            $updatedTransaction = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.brand',
                    'equipments.model'
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
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->leftJoin('users as approved_by_user', 'transactions.released_by', '=', 'approved_by_user.id')
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.brand',
                    'equipments.serial_number',
                    'equipments.model',
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
