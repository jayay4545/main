<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Equipment;
use App\Models\Request;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to create activity logs for
        $users = User::take(3)->get();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run user seeders first.');
            return;
        }

        // Sample activity logs
        $activities = [
            [
                'action' => 'Updated an Item',
                'description' => 'Updated accountability form configuration. No detailed field changes logged',
                'model_type' => 'App\\Models\\Equipment',
                'model_id' => 1,
            ],
            [
                'action' => 'Marked Request(s) for Release',
                'description' => 'Marked 1 item(s) as for release from request number(s): 893959 (on site)',
                'model_type' => 'App\\Models\\Request',
                'model_id' => 1,
            ],
            [
                'action' => 'Added an item',
                'description' => 'Laptop',
                'model_type' => 'App\\Models\\Equipment',
                'model_id' => 2,
            ],
            [
                'action' => 'Updated an Item',
                'description' => 'Updated accountability form configuration. No detailed field changes logged',
                'model_type' => 'App\\Models\\Equipment',
                'model_id' => 3,
            ],
            [
                'action' => 'Created a new request',
                'description' => 'Requested equipment for project assignment',
                'model_type' => 'App\\Models\\Request',
                'model_id' => 2,
            ],
            [
                'action' => 'Approved request',
                'description' => 'Approved equipment request #12345',
                'model_type' => 'App\\Models\\Request',
                'model_id' => 3,
            ],
            [
                'action' => 'Updated user profile',
                'description' => 'Updated personal information and contact details',
                'model_type' => 'App\\Models\\User',
                'model_id' => 1,
            ],
            [
                'action' => 'Added new equipment',
                'description' => 'Added new laptop to inventory',
                'model_type' => 'App\\Models\\Equipment',
                'model_id' => 4,
            ],
            [
                'action' => 'Processed transaction',
                'description' => 'Processed equipment checkout transaction',
                'model_type' => 'App\\Models\\Transaction',
                'model_id' => 1,
            ],
            [
                'action' => 'System maintenance',
                'description' => 'Performed database optimization',
                'model_type' => null,
                'model_id' => null,
            ],
        ];

        // Create activity logs with different timestamps
        foreach ($activities as $index => $activity) {
            $user = $users->random();
            $createdAt = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
            
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => $activity['action'],
                'description' => $activity['description'],
                'model_type' => $activity['model_type'],
                'model_id' => $activity['model_id'],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }

        $this->command->info('Activity logs seeded successfully!');
    }
}
