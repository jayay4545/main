<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Request;
use App\Models\User;
use App\Models\Equipment;
use Carbon\Carbon;

class RequestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users and equipment
        $users = User::where('role_id', function($query) {
            $query->select('id')->from('roles')->where('name', 'employee');
        })->get();
        
        $equipment = Equipment::all();
        $admins = User::whereIn('role_id', function($query) {
            $query->select('id')->from('roles')->whereIn('name', ['admin', 'super_admin']);
        })->get();

        if ($users->isEmpty() || $equipment->isEmpty()) {
            echo "⚠️  No users or equipment found. Please run UserSeeder and EquipmentSeeder first.\n";
            return;
        }

        $requestTypes = ['borrow', 'permanent_assignment', 'maintenance'];
        $requestModes = ['onsite', 'wfh', 'hybrid'];
        $statuses = ['pending', 'approved', 'rejected', 'cancelled'];
        $reasons = [
            'Need laptop for remote work setup',
            'Current equipment is outdated and needs replacement',
            'Additional monitor required for productivity',
            'Equipment needed for new project',
            'Temporary equipment for client meeting',
            'Development environment setup',
            'Design work requires high-resolution display',
            'Equipment malfunction - need replacement',
            'New employee onboarding',
            'Conference room presentation setup',
            'Field work equipment',
            'Backup equipment for critical operations',
            'Testing and quality assurance',
            'Training session requirements',
            'Emergency replacement needed'
        ];

        $requests = [];

        // Create pending requests (15 items)
        for ($i = 0; $i < 15; $i++) {
            $user = $users->random();
            $equipmentItem = $equipment->random();
            $requestType = $requestTypes[array_rand($requestTypes)];
            $requestMode = $requestModes[array_rand($requestModes)];
            $reason = $reasons[array_rand($reasons)];
            
            $startDate = Carbon::now()->addDays(rand(1, 7));
            $endDate = $requestType === 'permanent_assignment' 
                ? null 
                : $startDate->copy()->addDays(rand(30, 365));

            $requests[] = Request::create([
                'user_id' => $user->id,
                'equipment_id' => $equipmentItem->id,
                'request_type' => $requestType,
                'request_mode' => $requestMode,
                'reason' => $reason,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(rand(1, 14)),
                'updated_at' => Carbon::now()->subDays(rand(1, 14)),
            ]);
        }

        // Create approved requests (20 items)
        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $equipmentItem = $equipment->random();
            $requestType = $requestTypes[array_rand($requestTypes)];
            $requestMode = $requestModes[array_rand($requestModes)];
            $reason = $reasons[array_rand($reasons)];
            $admin = $admins->random();
            
            $startDate = Carbon::now()->subDays(rand(1, 30));
            $endDate = $requestType === 'permanent_assignment' 
                ? null 
                : $startDate->copy()->addDays(rand(30, 365));

            $requests[] = Request::create([
                'user_id' => $user->id,
                'equipment_id' => $equipmentItem->id,
                'request_type' => $requestType,
                'request_mode' => $requestMode,
                'reason' => $reason,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'approved',
                'approved_by' => $admin->id,
                'approved_at' => Carbon::now()->subDays(rand(1, 25)),
                'approval_notes' => 'Request approved for work requirements',
                'created_at' => Carbon::now()->subDays(rand(5, 35)),
                'updated_at' => Carbon::now()->subDays(rand(1, 25)),
            ]);
        }

        // Create rejected requests (5 items)
        for ($i = 0; $i < 5; $i++) {
            $user = $users->random();
            $equipmentItem = $equipment->random();
            $requestType = $requestTypes[array_rand($requestTypes)];
            $requestMode = $requestModes[array_rand($requestModes)];
            $reason = $reasons[array_rand($reasons)];
            $admin = $admins->random();
            
            $rejectionReasons = [
                'Equipment not available at this time',
                'Budget constraints - request denied',
                'Equipment already assigned to another user',
                'Request does not meet company policy',
                'Equipment under maintenance',
                'Insufficient justification provided',
                'Alternative equipment recommended',
                'Request outside of scope'
            ];

            $requests[] = Request::create([
                'user_id' => $user->id,
                'equipment_id' => $equipmentItem->id,
                'request_type' => $requestType,
                'request_mode' => $requestMode,
                'reason' => $reason,
                'start_date' => Carbon::now()->addDays(rand(1, 7)),
                'end_date' => Carbon::now()->addDays(rand(30, 365)),
                'status' => 'rejected',
                'approved_by' => $admin->id,
                'approved_at' => Carbon::now()->subDays(rand(1, 10)),
                'rejection_reason' => $rejectionReasons[array_rand($rejectionReasons)],
                'created_at' => Carbon::now()->subDays(rand(5, 15)),
                'updated_at' => Carbon::now()->subDays(rand(1, 10)),
            ]);
        }

        // Create cancelled requests (3 items)
        for ($i = 0; $i < 3; $i++) {
            $user = $users->random();
            $equipmentItem = $equipment->random();
            $requestType = $requestTypes[array_rand($requestTypes)];
            $requestMode = $requestModes[array_rand($requestModes)];
            $reason = $reasons[array_rand($reasons)];

            $requests[] = Request::create([
                'user_id' => $user->id,
                'equipment_id' => $equipmentItem->id,
                'request_type' => $requestType,
                'request_mode' => $requestMode,
                'reason' => $reason,
                'start_date' => Carbon::now()->addDays(rand(1, 7)),
                'end_date' => Carbon::now()->addDays(rand(30, 365)),
                'status' => 'cancelled',
                'created_at' => Carbon::now()->subDays(rand(3, 10)),
                'updated_at' => Carbon::now()->subDays(rand(1, 5)),
            ]);
        }

        echo "✅ Requests seeded successfully!\n";
        echo "📊 Created 15 pending requests\n";
        echo "📊 Created 20 approved requests\n";
        echo "📊 Created 5 rejected requests\n";
        echo "📊 Created 3 cancelled requests\n";
        echo "📊 Total: 43 requests created\n";
    }
}









