<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeUsers = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.name', 'employee')
            ->select('users.*')
            ->get();

        foreach ($employeeUsers as $user) {
            // Split full name into first and last (fallbacks if not present)
            $parts = preg_split('/\s+/', (string) $user->name);
            $firstName = $parts[0] ?? 'Employee';
            $lastName = $parts[1] ?? 'User';

            DB::table('employees')->insert([
                'employee_id' => $user->employee_id ?? ('EMP' . str_pad((string) $user->id, 3, '0', STR_PAD_LEFT)),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $user->email,
                'position' => $user->position ?? 'Staff',
                'department' => $user->department ?? null,
                'phone' => $user->phone ?? null,
                'status' => 'active',
                'hire_date' => now()->subYears(1)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}


