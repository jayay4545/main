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
            // Super Admin
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
            // Admins
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
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'employee_id' => 'EMP003',
                'position' => 'IT Manager',
                'department' => 'IT',
                'phone' => '+1234567892',
                'role_id' => $adminRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'employee_id' => 'EMP004',
                'position' => 'Operations Manager',
                'department' => 'Operations',
                'phone' => '+1234567893',
                'role_id' => $adminRole->id,
                'is_active' => true,
            ],
            // NOC Team
            [
                'name' => 'John Paul Francisco',
                'email' => 'john.francisco@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP005',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567894',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Kyle Dela Cruz',
                'email' => 'kyle.delacruz@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP006',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567895',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Rica Alorro',
                'email' => 'rica.alorro@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP007',
                'position' => 'NOC Tier 1',
                'department' => 'Operations',
                'phone' => '+1234567896',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Carlo Divino',
                'email' => 'carlo.divino@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP008',
                'position' => 'NOC Tier 2',
                'department' => 'Operations',
                'phone' => '+1234567897',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Development Team
            [
                'name' => 'Maria Santos',
                'email' => 'maria.santos@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP009',
                'position' => 'Senior Developer',
                'department' => 'Development',
                'phone' => '+1234567898',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'David Rodriguez',
                'email' => 'david.rodriguez@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP010',
                'position' => 'Full Stack Developer',
                'department' => 'Development',
                'phone' => '+1234567899',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Jennifer Kim',
                'email' => 'jennifer.kim@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP011',
                'position' => 'Frontend Developer',
                'department' => 'Development',
                'phone' => '+1234567900',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Robert Wilson',
                'email' => 'robert.wilson@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP012',
                'position' => 'Backend Developer',
                'department' => 'Development',
                'phone' => '+1234567901',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Design Team
            [
                'name' => 'Lisa Thompson',
                'email' => 'lisa.thompson@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP013',
                'position' => 'UI/UX Designer',
                'department' => 'Design',
                'phone' => '+1234567902',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Alex Martinez',
                'email' => 'alex.martinez@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP014',
                'position' => 'Graphic Designer',
                'department' => 'Design',
                'phone' => '+1234567903',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Sales Team
            [
                'name' => 'Amanda Davis',
                'email' => 'amanda.davis@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP015',
                'position' => 'Sales Manager',
                'department' => 'Sales',
                'phone' => '+1234567904',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'James Brown',
                'email' => 'james.brown@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP016',
                'position' => 'Sales Representative',
                'department' => 'Sales',
                'phone' => '+1234567905',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Marketing Team
            [
                'name' => 'Emily Taylor',
                'email' => 'emily.taylor@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP017',
                'position' => 'Marketing Specialist',
                'department' => 'Marketing',
                'phone' => '+1234567906',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Christopher Lee',
                'email' => 'christopher.lee@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP018',
                'position' => 'Content Creator',
                'department' => 'Marketing',
                'phone' => '+1234567907',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // HR Team
            [
                'name' => 'Rachel Green',
                'email' => 'rachel.green@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP019',
                'position' => 'HR Manager',
                'department' => 'Human Resources',
                'phone' => '+1234567908',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Daniel White',
                'email' => 'daniel.white@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP020',
                'position' => 'HR Coordinator',
                'department' => 'Human Resources',
                'phone' => '+1234567909',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Finance Team
            [
                'name' => 'Michelle Garcia',
                'email' => 'michelle.garcia@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP021',
                'position' => 'Finance Manager',
                'department' => 'Finance',
                'phone' => '+1234567910',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Kevin Anderson',
                'email' => 'kevin.anderson@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP022',
                'position' => 'Accountant',
                'department' => 'Finance',
                'phone' => '+1234567911',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            // Customer Support
            [
                'name' => 'Nicole Clark',
                'email' => 'nicole.clark@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP023',
                'position' => 'Customer Support Lead',
                'department' => 'Customer Support',
                'phone' => '+1234567912',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
            [
                'name' => 'Thomas Moore',
                'email' => 'thomas.moore@ireply.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'employee_id' => 'EMP024',
                'position' => 'Customer Support Agent',
                'department' => 'Customer Support',
                'phone' => '+1234567913',
                'role_id' => $employeeRole->id,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
