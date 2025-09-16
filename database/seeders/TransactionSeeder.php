<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Request;
use App\Models\User;
use App\Models\Equipment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admins who process transactions
        $admins = User::whereIn('role_id', function($query) {
            $query->select('id')->from('roles')->whereIn('name', ['admin', 'super_admin']);
        })->get();

        $employees = DB::table('employees')->get();
        $equipment = Equipment::all();
        $requests = Request::all();

        if ($admins->isEmpty() || $employees->isEmpty() || $equipment->isEmpty()) {
            echo "⚠️  Missing required data for transactions.\n";
            return;
        }

        $conditions = ['good_condition', 'brand_new', 'damaged'];
        $modes = ['on_site', 'work_from_home'];

        // Released (current holders)
        for ($i = 0; $i < 10; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->isNotEmpty() ? $requests->random() : null;
            $admin = $admins->random();

            // Update equipment status to in_use
            $equipmentItem->update(['status' => 'in_use']);

            DB::table('transactions')->insert([
                'transaction_number' => 'TRX' . str_pad((string) rand(1, 999999), 6, '0', STR_PAD_LEFT),
                'user_id' => $admin->id,
                'employee_id' => $employee->id,
                'equipment_id' => $equipmentItem->id,
                'request_id' => $request?->id,
                'status' => 'released',
                'request_mode' => $modes[array_rand($modes)],
                'release_condition' => $conditions[array_rand($conditions)],
                'release_date' => Carbon::now()->subDays(rand(1, 14))->format('Y-m-d'),
                'released_by' => $admin->id,
                'expected_return_date' => Carbon::now()->addDays(rand(7, 60))->format('Y-m-d'),
                'created_at' => Carbon::now()->subDays(rand(1, 14)),
                'updated_at' => Carbon::now()->subDays(rand(1, 14)),
            ]);
        }

        // Returned (for verification)
        for ($i = 0; $i < 6; $i++) {
            $employee = $employees->random();
            $equipmentItem = $equipment->random();
            $request = $requests->isNotEmpty() ? $requests->random() : null;
            $admin = $admins->random();

            // Update equipment status to available
            $equipmentItem->update(['status' => 'available']);

            DB::table('transactions')->insert([
                'transaction_number' => 'TRX' . str_pad((string) rand(1, 999999), 6, '0', STR_PAD_LEFT),
                'user_id' => $admin->id,
                'employee_id' => $employee->id,
                'equipment_id' => $equipmentItem->id,
                'request_id' => $request?->id,
                'status' => 'returned',
                'request_mode' => $modes[array_rand($modes)],
                'release_condition' => $conditions[array_rand($conditions)],
                'release_date' => Carbon::now()->subDays(rand(20, 60))->format('Y-m-d'),
                'released_by' => $admin->id,
                'return_condition' => $conditions[array_rand($conditions)],
                'return_date' => Carbon::now()->subDays(rand(1, 7))->format('Y-m-d'),
                'received_by' => $admin->id,
                'expected_return_date' => Carbon::now()->subDays(rand(1, 7))->format('Y-m-d'),
                'created_at' => Carbon::now()->subDays(rand(20, 60)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }

        echo "✅ Transactions seeded successfully!\n";
        echo "📊 Created 10 released (current holders)\n";
        echo "📊 Created 6 returned (verify return)\n";
    }
}