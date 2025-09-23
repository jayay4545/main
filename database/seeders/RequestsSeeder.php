<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RequestsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('requests')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $requestTypes = ['new_assignment', 'replacement', 'additional'];
        $requestModes = ['on_site', 'work_from_home'];
        $statuses = ['pending', 'approved', 'rejected', 'fulfilled'];
        $reasons = [
            'Need equipment for new project',
            'Current equipment is malfunctioning',
            'Additional equipment for team collaboration',
            'Equipment upgrade required for new software',
            'Temporary replacement while main equipment is under repair',
            'New hire equipment setup',
            'Project-specific equipment request',
            'Work from home setup requirement',
            'Equipment for client presentation',
            'Backup equipment request',
            // Additional reasons for approved requests
            'Development team expansion',
            'Equipment upgrade for new software requirements',
            'Remote work setup requirement',
            'Project collaboration tools needed',
            'Hardware refresh program'
        ];

        $requests = [];

        // Original 10 random requests
        for ($i = 1; $i <= 10; $i++) {
            $requestDate = Carbon::now()->subDays(rand(1, 30));
            $status = $statuses[array_rand($statuses)];
            
            $request = [
                'request_number' => 'REQ-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'employee_id' => rand(1, 2),
                'equipment_id' => rand(1, 2),
                'request_type' => $requestTypes[array_rand($requestTypes)],
                'request_mode' => $requestModes[array_rand($requestModes)],
                'reason' => $reasons[$i - 1],
                'requested_date' => $requestDate,
                'expected_start_date' => $requestDate->copy()->addDays(rand(1, 7)),
                'expected_end_date' => $requestDate->copy()->addDays(rand(30, 90)),
                'status' => $status,
                'approved_by' => null,
                'approved_at' => null,
                'approval_notes' => null,
                'rejection_reason' => null,
                'created_at' => $requestDate,
                'updated_at' => $requestDate
            ];

            // Add approval info for approved and fulfilled requests
            if (in_array($status, ['approved', 'fulfilled'])) {
                $request['approved_by'] = 1;
                $request['approved_at'] = $requestDate->copy()->addDays(rand(1, 3));
                $request['approval_notes'] = 'Request reviewed and approved';
            }
            // Add rejection reason for rejected requests
            else if ($status === 'rejected') {
                $request['rejection_reason'] = 'Does not meet current requirements';
            }

            $requests[] = $request;
        }

        // Additional 5 approved requests
        for ($i = 11; $i <= 15; $i++) {
            $requestDate = Carbon::now()->subDays(rand(1, 15)); // More recent requests
            
            $request = [
                'request_number' => 'REQ-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'employee_id' => rand(1, 2),
                'equipment_id' => rand(1, 2),
                'request_type' => $requestTypes[array_rand($requestTypes)],
                'request_mode' => $requestModes[array_rand($requestModes)],
                'reason' => $reasons[$i - 1],
                'requested_date' => $requestDate,
                'expected_start_date' => $requestDate->copy()->addDays(2), // Shorter waiting time for approved requests
                'expected_end_date' => $requestDate->copy()->addDays(60),
                'status' => 'approved',
                'approved_by' => 1, // Admin user ID
                'approved_at' => $requestDate->copy()->addDays(1), // Quick approval
                'approval_notes' => 'Priority request approved',
                'rejection_reason' => null,
                'created_at' => $requestDate,
                'updated_at' => $requestDate
            ];

            $requests[] = $request;
        }

        DB::table('requests')->insert($requests);
    }
}
