<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('transactions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Create transactions for approved requests
        DB::table('transactions')->insert([
            [
                'transaction_number' => 'TRX-' . date('Ymd') . '-001',
                'user_id' => 1, // Admin user (since that's what we have)
                'employee_id' => 1, // First employee
                'equipment_id' => 1, // First equipment
                'request_id' => null, // No request for now
                'status' => 'released',
                'request_mode' => 'on_site',
                'release_condition' => 'good_condition',
                'release_date' => Carbon::now(),
                'released_by' => 1, // Released by admin
                'return_condition' => null,
                'return_date' => null,
                'expected_return_date' => Carbon::now()->addDays(30),
                'received_by' => null,
                'release_notes' => 'Development laptop issued',
                'return_notes' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'transaction_number' => 'TRX-20250918-002',
                'user_id' => 1,
                'employee_id' => 2,
                'equipment_id' => 2,
                'request_id' => 2,
                'status' => 'returned',
                'request_mode' => 'work_from_home',
                'release_condition' => 'good_condition',
                'release_date' => Carbon::now()->subDays(10),
                'released_by' => 1,
                'return_condition' => 'good_condition',
                'return_date' => Carbon::now()->subDay(),
                'expected_return_date' => Carbon::now()->addDays(20),
                'received_by' => 1,
                'release_notes' => 'Issued for remote work',
                'return_notes' => 'Returned in good condition',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
