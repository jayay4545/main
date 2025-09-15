<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => [
                    'equipment.create', 'equipment.read', 'equipment.update', 'equipment.delete',
                    'requests.create', 'requests.read', 'requests.update', 'requests.delete', 'requests.approve', 'requests.reject',
                    'transactions.create', 'transactions.read', 'transactions.update', 'transactions.delete',
                    'users.create', 'users.read', 'users.update', 'users.delete',
                    'roles.create', 'roles.read', 'roles.update', 'roles.delete',
                    'reports.read', 'analytics.read'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Administrative access with most permissions',
                'permissions' => [
                    'equipment.create', 'equipment.read', 'equipment.update', 'equipment.delete',
                    'requests.create', 'requests.read', 'requests.update', 'requests.delete', 'requests.approve', 'requests.reject',
                    'transactions.create', 'transactions.read', 'transactions.update', 'transactions.delete',
                    'users.create', 'users.read', 'users.update',
                    'reports.read', 'analytics.read'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'employee',
                'display_name' => 'Employee',
                'description' => 'Basic employee access for equipment requests',
                'permissions' => [
                    'equipment.read',
                    'requests.create', 'requests.read', 'requests.update',
                    'transactions.read'
                ],
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::create($role);
        }
    }
}
