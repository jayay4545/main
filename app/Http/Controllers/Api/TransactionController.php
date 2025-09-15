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
            $transactions = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category'
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
                'employee_id' => 'required|exists:employees,id',
                'equipment_id' => 'required|exists:equipments,id',
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
                ->where('transactions.id', $id)
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category'
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
}
