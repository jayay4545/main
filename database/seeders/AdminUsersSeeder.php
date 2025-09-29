<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminUsersSeeder extends Seeder
{
    public function run()
    {
        // First, ensure we have the necessary roles
        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        $superAdminRole = DB::table('roles')->where('name', 'super_admin')->first();
        $employeeRole = DB::table('roles')->where('name', 'employee')->first();

        // Create roles if they don't exist
        if (!$adminRole) {
            DB::table('roles')->insert([
                'id' => 1,
                'name' => 'admin',
                'display_name' => 'IT Admin',
                'description' => 'IT Administrator',
                'permissions' => json_encode(['manage_users', 'manage_equipment', 'approve_requests', 'view_reports']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $adminRole = (object)['id' => 1];
        }

        if (!$superAdminRole) {
            DB::table('roles')->insert([
                'id' => 2,
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Super Administrator with full access',
                'permissions' => json_encode(['*']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $superAdminRole = (object)['id' => 2];
        }

        if (!$employeeRole) {
            DB::table('roles')->insert([
                'id' => 3,
                'name' => 'employee',
                'display_name' => 'Employee',
                'description' => 'Regular Employee',
                'permissions' => json_encode(['view_equipment', 'request_equipment']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $employeeRole = (object)['id' => 3];
        }

        // Create admin users based on the Users page data
        $adminUsers = [
            [
                'name' => 'Albert Fernandez',
                'email' => 'albert@ireply.com',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'employee_id' => 'Albertrg19',
                'position' => 'IT Administrator',
                'department' => 'IT Department',
                'phone' => '+1234567890',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'France Magdalaro',
                'email' => 'Superadmin@hris.com',
                'password' => Hash::make('admin123'),
                'role_id' => $superAdminRole->id,
                'employee_id' => 'France30',
                'position' => 'Super Administrator',
                'department' => 'IT Department',
                'phone' => '+1234567891',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Create employee users
        $employeeUsers = [
            [
                'name' => 'Albert Fernandez',
                'email' => 'bhozkalbert@gmail.com',
                'password' => Hash::make('password123'),
                'role_id' => $employeeRole->id,
                'employee_id' => 'EMP1758686950',
                'position' => 'Employee',
                'department' => 'General',
                'phone' => '+1234567892',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password123'),
                'role_id' => $employeeRole->id,
                'employee_id' => 'EMP002',
                'position' => 'Employee',
                'department' => 'General',
                'phone' => '+1234567893',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'john paul francisco',
                'email' => 'johnpaul@ireply',
                'password' => Hash::make('password123'),
                'role_id' => $employeeRole->id,
                'employee_id' => 'EMP1758694311',
                'position' => 'Employee',
                'department' => 'General',
                'phone' => '+1234567894',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Rica alorro',
                'email' => 'rica@ireply',
                'password' => Hash::make('password123'),
                'role_id' => $employeeRole->id,
                'employee_id' => 'EMP1758687176',
                'position' => 'Employee',
                'department' => 'General',
                'phone' => '+1234567895',
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Insert admin users
        foreach ($adminUsers as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                $user
            );
        }

        // Insert employee users
        foreach ($employeeUsers as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                $user
            );
        }

        $this->command->info('Admin and employee users created successfully!');
        $this->command->info('Admin credentials:');
        $this->command->info('Albert Fernandez: albert@ireply.com / admin123');
        $this->command->info('France Magdalaro: Superadmin@hris.com / admin123');
    }
}
