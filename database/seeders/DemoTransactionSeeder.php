<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get employees from database
        $employees = [];
        $employeeNames = ['John Paul', 'Kyle', 'Rica', 'Carlo'];
        
        foreach ($employeeNames as $firstName) {
            $employee = DB::table('employees')->where('first_name', $firstName)->first();
            if ($employee) {
                $employees[$firstName] = $employee;
            }
        }
        
        // If no employees found, create them
        if (empty($employees)) {
            // Create sample employees if they don't exist
            $employeeData = [
                ['John Paul Francisco', 'john.paul@company.com', 'NOC tier 1', 'IT Department'],
                ['Kyle Dela Cruz', 'kyle.dela@company.com', 'NOC tier 1', 'IT Department'],
                ['Rica Alorro', 'rica.alorro@company.com', 'NOC tier 1', 'IT Department'],
                ['Carlo Divino', 'carlo.divino@company.com', 'NOC tier 1', 'IT Department'],
            ];
            
            foreach ($employeeData as $index => $emp) {
                $firstName = explode(' ', $emp[0])[0];
                $lastName = implode(' ', array_slice(explode(' ', $emp[0]), 1));
                $id = DB::table('employees')->insertGetId([
                    'employee_id' => 'EMP' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $emp[1],
                    'position' => $emp[2],
                    'department' => $emp[3],
                    'phone' => '+63' . rand(9000000000, 9999999999),
                    'status' => 'active',
                    'hire_date' => Carbon::now()->subMonths(rand(1, 24)),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                $employees[$firstName] = DB::table('employees')->where('id', $id)->first();
            }
        }

        // Find or create equipment
        $equipment = DB::table('equipments')->first();
        
        // If no equipment found, create one
        if (!$equipment) {
            $equipmentId = DB::table('equipments')->insertGetId([
                'equipment_code' => 'EQ001',
                'name' => 'Sample Equipment',
                'category' => 'Laptop',
                'brand' => 'Dell',
                'model' => 'Inspiron',
                'description' => 'Sample equipment for testing',
                'status' => 'available',
                'condition' => 'good_condition',
                'purchase_date' => Carbon::now()->subMonths(1),
                'purchase_price' => 1000,
                'notes' => 'Created by seeder',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $equipment = DB::table('equipments')->where('id', $equipmentId)->first();
        }
        
        // Find or create user
        $user = DB::table('users')->first();
        
        // If no user found, create one
        if (!$user) {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $user = DB::table('users')->where('id', $userId)->first();
        }

        // Insert New Requests
        foreach ($employees as $name => $employee) {
            if ($employee && $equipment) {
                DB::table('requests')->insert([
                    'request_number' => 'REQ_' . $employee->id,
                    'employee_id' => $employee->id,
                    'equipment_id' => $equipment->id,
                    'request_type' => 'new_assignment',
                    'request_mode' => 'work_from_home',
                    'status' => 'pending',
                    'reason' => 'Work requirement',
                    'requested_date' => Carbon::now(),
                    'expected_start_date' => Carbon::now()->addDays(1),
                    'expected_end_date' => Carbon::now()->addDays(30),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Insert Current Holder transactions
        foreach ($employees as $name => $employee) {
            if ($employee && $equipment && $user) {
                DB::table('transactions')->insert([
                    'transaction_number' => 'TXN_' . $employee->id,
                    'user_id' => $user->id,
                    'employee_id' => $employee->id,
                    'equipment_id' => $equipment->id,
                    'request_id' => null,
                    'status' => 'released',
                    'request_mode' => 'work_from_home',
                    'release_condition' => 'good_condition',
                    'release_date' => Carbon::now()->subDays(2),
                    'released_by' => $user->id,
                    'expected_return_date' => Carbon::now()->addDays(30),
                    'release_notes' => 'Equipment released for work use',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Insert Verify Return transactions
        foreach ($employees as $name => $employee) {
            if ($employee && $equipment && $user) {
                DB::table('transactions')->insert([
                    'transaction_number' => 'TXN_RETURN_' . $employee->id,
                    'user_id' => $user->id,
                    'employee_id' => $employee->id,
                    'equipment_id' => $equipment->id,
                    'request_id' => null,
                    'status' => 'returned',
                    'request_mode' => 'work_from_home',
                    'release_condition' => 'good_condition',
                    'release_date' => Carbon::now()->subDays(10),
                    'released_by' => $user->id,
                    'return_condition' => 'good_condition',
                    'return_date' => Carbon::now(),
                    'expected_return_date' => Carbon::now()->addDays(30),
                    'received_by' => $user->id,
                    'release_notes' => 'Equipment released for work use',
                    'return_notes' => 'Equipment returned in good condition',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
