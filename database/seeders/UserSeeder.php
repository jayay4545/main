<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $superAdminRole = \App\Models\Role::where('name', 'super_admin')->first();
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        $employeeRole = \App\Models\Role::where('name', 'employee')->first();

        $users = [
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'employee_id' => 'EMP001',
                'position' => 'Super Administrator',
                'department' => 'IT',
                'phone' => '+1234567890',
                'role_id' => $superAdminRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Administrator',
                'email' => 'admin@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'employee_id' => 'EMP002',
                'position' => 'System Administrator',
                'department' => 'IT',
                'phone' => '+1234567891',
                'role_id' => $adminRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'John Paul Francisco',
                'email' => 'john.francisco@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP003',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567892',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Kyle Dela Cruz',
                'email' => 'kyle.delacruz@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP004',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567893',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Rica Alorro',
                'email' => 'rica.alorro@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP005',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567894',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Carlo Divino',
                'email' => 'carlo.divino@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP006',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567895',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
