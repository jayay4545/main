<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
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