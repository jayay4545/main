<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RolesSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        DB::table('roles')->insert([
            [
                'id' => 1,
                'name' => 'admin',
                'display_name' => 'IT Admin',
                'description' => 'IT Administrator',
                'permissions' => json_encode(['manage_users', 'manage_equipment', 'approve_requests', 'view_reports']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'name' => 'super_admin',
                'display_name' => 'Super Administrator',
                'description' => 'Super Administrator with full access',
                'permissions' => json_encode(['*']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'name' => 'employee',
                'display_name' => 'Employee',
                'description' => 'Regular Employee',
                'permissions' => json_encode(['view_equipment', 'request_equipment']),
                'is_active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
