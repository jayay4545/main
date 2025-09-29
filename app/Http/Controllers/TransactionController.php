<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Generate a receipt for the transaction
     */
    public function print($id)
    {
        try {
            // Get the transaction with related data
            $transaction = \App\Models\Transaction::with(['user', 'employee', 'equipment', 'releasedBy', 'receivedBy'])
                ->where('id', $id)
                ->first();

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => "Transaction with ID {$id} not found"
                ], 404);
            }

            // Ensure all required relationships are loaded
            if (!$transaction->employee || !$transaction->equipment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction is missing required related data (employee or equipment)'
                ], 500);
            }

            // Format the data for the receipt
            $receiptData = [
                'transaction' => [
                    'number' => $transaction->transaction_number,
                    'status' => ucfirst($transaction->status),
                    'request_mode' => $transaction->request_mode ? ucwords(str_replace('_', ' ', $transaction->request_mode)) : null,
                    'created_at' => $transaction->created_at->format('F j, Y, g:i a'),
                ],
                'equipment' => [
                    'name' => $transaction->equipment->name,
                    'serial_number' => $transaction->equipment->serial_number,
                    'model' => $transaction->equipment->model,
                    'brand' => $transaction->equipment->brand,
                ],
                'employee' => [
                    'name' => $transaction->employee->first_name . ' ' . $transaction->employee->last_name,
                    'first_name' => $transaction->employee->first_name,
                    'last_name' => $transaction->employee->last_name,
                    'full_name' => $transaction->employee->first_name . ' ' . $transaction->employee->last_name,
                    'position' => $transaction->employee->position,
                    'department' => $transaction->employee->department,
                ],
                'release_info' => $transaction->release_date ? [
                    'date' => date('F j, Y', strtotime($transaction->release_date)),
                    'condition' => ucwords(str_replace('_', ' ', $transaction->release_condition)),
                    'released_by' => $transaction->releasedBy ? $transaction->releasedBy->name : null,
                    'notes' => $transaction->release_notes,
                    'expected_return_date' => $transaction->expected_return_date ? 
                        date('F j, Y', strtotime($transaction->expected_return_date)) : null,
                ] : null,
                'return_info' => $transaction->return_date ? [
                    'date' => date('F j, Y', strtotime($transaction->return_date)),
                    'condition' => ucwords(str_replace('_', ' ', $transaction->return_condition)),
                    'received_by' => $transaction->receivedBy ? $transaction->receivedBy->name : null,
                    'notes' => $transaction->return_notes,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'data' => $receiptData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating receipt: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Get dashboard metrics
     */
    public function dashboard()
    {
        try {
            $newRequests = DB::table('requests')->where('status', 'pending')->count();
            $currentHolders = DB::table('transactions')->where('status', 'released')->count();
            $verifyReturns = DB::table('transactions')->where('status', 'returned')->count();

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
     * Get all transactions
     */
    public function index()
    {
        try {
            $transactions = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->leftJoin('users as released_by_user', 'transactions.released_by', '=', 'released_by_user.id')
                ->leftJoin('users as received_by_user', 'transactions.received_by', '=', 'received_by_user.id')
                ->select(
                    'transactions.*',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category',
                    'released_by_user.name as released_by_name',
                    'received_by_user.name as received_by_name'
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
     * Update transaction status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,released,returned,lost,damaged'
            ]);

            $transaction = DB::table('transactions')->where('id', $id)->first();
            
            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction not found'
                ], 404);
            }

            DB::table('transactions')
                ->where('id', $id)
                ->update([
                    'status' => $request->status,
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating transaction: ' . $e->getMessage()
            ], 500);
        }
    }
}