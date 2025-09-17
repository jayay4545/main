<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Request;
use App\Models\User;
use App\Models\Equipment;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing data
        $users = User::whereIn('role_id', function($query) {
            $query->select('id')->from('roles')->whereIn('name', ['admin', 'super_admin']);
        })->get();
        
        $employees = User::where('role_id', function($query) {
            $query->select('id')->from('roles')->where('name', 'employee');
        })->get();
        
        $equipment = Equipment::all();
        $requests = Request::all();

        if ($users->isEmpty() || $employees->isEmpty() || $equipment->isEmpty()) {
            echo "⚠️  Missing required data. Please ensure all seeders have run successfully.\n";
            return;
        }

        $transactionTypes = ['issue', 'return', 'transfer', 'maintenance'];
        $statuses = ['active', 'completed', 'overdue', 'cancelled'];
        $conditions = ['excellent', 'good', 'fair', 'poor'];

        // Create active transactions (equipment currently issued)
        for ($i = 0; $i < 15; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->random();
            $admin = $users->random();
            
            // Update equipment status to in_use
            $equipmentItem->update(['status' => 'in_use']);

            Transaction::create([
                'request_id' => $request->id,
                'equipment_id' => $equipmentItem->id,
                'user_id' => $employee->id,
                'transaction_type' => 'issue',
                'status' => 'active',
                'issued_at' => Carbon::now()->subDays(rand(1, 30)),
                'expected_return_date' => Carbon::now()->addDays(rand(30, 180)),
                'condition_on_issue' => $conditions[array_rand($conditions)],
                'notes' => 'Equipment issued for work use',
                'processed_by' => $admin->id,
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
                'updated_at' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }

        // Create completed transactions (equipment returned)
        for ($i = 0; $i < 10; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->random();
            $admin = $users->random();
            
            // Update equipment status to available
            $equipmentItem->update(['status' => 'available']);

            Transaction::create([
                'request_id' => $request->id,
                'equipment_id' => $equipmentItem->id,
                'user_id' => $employee->id,
                'transaction_type' => 'return',
                'status' => 'completed',
                'issued_at' => Carbon::now()->subDays(rand(30, 60)),
                'returned_at' => Carbon::now()->subDays(rand(1, 7)),
                'expected_return_date' => Carbon::now()->subDays(rand(1, 7)),
                'condition_on_issue' => $conditions[array_rand($conditions)],
                'condition_on_return' => $conditions[array_rand($conditions)],
                'notes' => 'Equipment returned successfully',
                'processed_by' => $admin->id,
                'created_at' => Carbon::now()->subDays(rand(30, 60)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }

        // Create overdue transactions
        for ($i = 0; $i < 3; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->random();
            $admin = $users->random();
            
            // Update equipment status to in_use
            $equipmentItem->update(['status' => 'in_use']);

            Transaction::create([
                'request_id' => $request->id,
                'equipment_id' => $equipmentItem->id,
                'user_id' => $employee->id,
                'transaction_type' => 'issue',
                'status' => 'overdue',
                'issued_at' => Carbon::now()->subDays(rand(60, 90)),
                'expected_return_date' => Carbon::now()->subDays(rand(1, 30)),
                'condition_on_issue' => $conditions[array_rand($conditions)],
                'notes' => 'Equipment overdue for return',
                'processed_by' => $admin->id,
                'created_at' => Carbon::now()->subDays(rand(60, 90)),
                'updated_at' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }

        // Create maintenance transactions
        for ($i = 0; $i < 2; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->random();
            $admin = $users->random();
            
            // Update equipment status to maintenance
            $equipmentItem->update(['status' => 'maintenance']);

            Transaction::create([
                'request_id' => $request->id,
                'equipment_id' => $equipmentItem->id,
                'user_id' => $employee->id,
                'transaction_type' => 'maintenance',
                'status' => 'active',
                'issued_at' => Carbon::now()->subDays(rand(1, 7)),
                'condition_on_issue' => 'poor',
                'notes' => 'Equipment sent for maintenance',
                'processed_by' => $admin->id,
                'created_at' => Carbon::now()->subDays(rand(1, 7)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }

        echo "✅ Transactions seeded successfully!\n";
        echo "📊 Created 15 active transactions\n";
        echo "📊 Created 10 completed transactions\n";
        echo "📊 Created 3 overdue transactions\n";
        echo "📊 Created 2 maintenance transactions\n";
        echo "📊 Total: 30 transactions created\n";
    }
}