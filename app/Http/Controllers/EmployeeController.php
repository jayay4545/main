<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    /**
     * Get all employees
     */
    public function index()
    {
        try {
            $employees = DB::table('employees')
                ->where('status', 'active')
                ->orderBy('first_name', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $employees,
                'count' => $employees->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching employees: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employee by ID
     */
    public function show($id)
    {
        try {
            $employee = DB::table('employees')->where('id', $id)->first();
            
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $employee
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching employee: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employees with their current equipment assignments
     */
    public function currentHolders()
    {
        try {
            $currentHolders = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->where('transactions.status', 'released')
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.transaction_number',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category',
                    'transactions.request_mode',
                    'transactions.expected_return_date',
                    'transactions.release_date'
                )
                ->orderBy('transactions.release_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $currentHolders,
                'count' => $currentHolders->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching current holders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employees with pending requests
     */
    public function pendingRequests()
    {
        try {
            $pendingRequests = DB::table('requests')
                ->join('employees', 'requests.employee_id', '=', 'employees.id')
                ->join('equipments', 'requests.equipment_id', '=', 'equipments.id')
                ->where('requests.status', 'pending')
                ->select(
                    'requests.id as request_id',
                    'requests.request_number',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category',
                    'requests.request_mode',
                    'requests.reason',
                    'requests.requested_date'
                )
                ->orderBy('requests.requested_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pendingRequests,
                'count' => $pendingRequests->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending requests: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employees with returned equipment for verification
     */
    public function verifyReturns()
    {
        try {
            $verifyReturns = DB::table('transactions')
                ->join('employees', 'transactions.employee_id', '=', 'employees.id')
                ->join('equipments', 'transactions.equipment_id', '=', 'equipments.id')
                ->where('transactions.status', 'returned')
                ->select(
                    'transactions.id as transaction_id',
                    'transactions.transaction_number',
                    'employees.first_name',
                    'employees.last_name',
                    'employees.position',
                    'equipments.name as equipment_name',
                    'equipments.category',
                    'transactions.return_date',
                    'transactions.expected_return_date',
                    'transactions.return_condition'
                )
                ->orderBy('transactions.return_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $verifyReturns,
                'count' => $verifyReturns->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching verify returns: ' . $e->getMessage()
            ], 500);
        }
    }
}