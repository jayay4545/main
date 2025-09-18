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
        DB::table('transactions')->insert([
            [
                'transaction_number' => 'TRX-20250918-001',
                'user_id' => 1,
                'employee_id' => 1,
                'equipment_id' => 1,
                'request_id' => 1,
                'status' => 'released',
                'request_mode' => 'on_site',
                'release_condition' => 'good_condition',
                'release_date' => Carbon::now()->subDays(2),
                'released_by' => 1,
                'return_condition' => null,
                'return_date' => null,
                'expected_return_date' => Carbon::now()->addDays(30),
                'received_by' => null,
                'release_notes' => 'Issued for project use',
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
