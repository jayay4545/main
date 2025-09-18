<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SimpleRequestsSeeder extends Seeder
{
    public function run()
    {
        DB::table('requests')->insert([
            [
                'employee_id' => 1,
                'equipment_id' => 1,
                'request_type' => 'new_assignment',
                'request_mode' => 'on_site',
                'reason' => 'Need laptop for remote work setup',
                'requested_date' => Carbon::now()->subDays(5),
                'expected_start_date' => Carbon::now()->addDays(2),
                'expected_end_date' => Carbon::now()->addDays(32),
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'employee_id' => 2,
                'equipment_id' => 2,
                'request_type' => 'replacement',
                'request_mode' => 'work_from_home',
                'reason' => 'Equipment malfunction - need replacement',
                'requested_date' => Carbon::now()->subDays(10),
                'expected_start_date' => Carbon::now()->addDays(1),
                'expected_end_date' => Carbon::now()->addDays(31),
                'status' => 'approved',
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
        ]);
    }
}
