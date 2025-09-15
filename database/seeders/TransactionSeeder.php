<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample users (admins/managers)
        $adminUser = DB::table('users')->insertGetId([
            'name' => 'Admin User',
            'email' => 'admin@company.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $managerUser = DB::table('users')->insertGetId([
            'name' => 'Manager User',
            'email' => 'manager@company.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Create sample employees
        $employees = [];
        $employeeData = [
            ['John Paul Francisco', 'john.paul@company.com', 'NOC tier 1', 'IT Department'],
            ['Kyle Dela Cruz', 'kyle.dela@company.com', 'NOC tier 1', 'IT Department'],
            ['Rica Alorro', 'rica.alorro@company.com', 'NOC tier 1', 'IT Department'],
            ['Carlo Divino', 'carlo.divino@company.com', 'NOC tier 1', 'IT Department'],
            ['Maria Santos', 'maria.santos@company.com', 'Developer', 'IT Department'],
            ['Juan Perez', 'juan.perez@company.com', 'Designer', 'Creative Department'],
            ['Ana Garcia', 'ana.garcia@company.com', 'Manager', 'Operations'],
            ['Luis Rodriguez', 'luis.rodriguez@company.com', 'Analyst', 'Finance'],
            ['Sofia Martinez', 'sofia.martinez@company.com', 'Coordinator', 'HR'],
            ['Carlos Lopez', 'carlos.lopez@company.com', 'Specialist', 'IT Department'],
        ];

        foreach ($employeeData as $index => $emp) {
            $employees[] = DB::table('employees')->insertGetId([
                'employee_id' => 'EMP' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'first_name' => explode(' ', $emp[0])[0],
                'last_name' => implode(' ', array_slice(explode(' ', $emp[0]), 1)),
                'email' => $emp[1],
                'position' => $emp[2],
                'department' => $emp[3],
                'phone' => '+63' . rand(9000000000, 9999999999),
                'status' => 'active',
                'hire_date' => Carbon::now()->subMonths(rand(1, 24)),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create sample equipment
        $equipments = [];
        $equipmentData = [
            ['LAP001', 'Dell Laptop', 'Laptop', 'Dell', 'Inspiron 15 3000'],
            ['LAP002', 'HP Laptop', 'Laptop', 'HP', 'Pavilion 15'],
            ['LAP003', 'MacBook Pro', 'Laptop', 'Apple', 'MacBook Pro 13"'],
            ['MON001', 'Dell Monitor', 'Monitor', 'Dell', '24" LED'],
            ['MON002', 'Samsung Monitor', 'Monitor', 'Samsung', '27" 4K'],
            ['MON003', 'LG Monitor', 'Monitor', 'LG', '22" IPS'],
            ['KEY001', 'Mechanical Keyboard', 'Keyboard', 'Logitech', 'MX Keys'],
            ['KEY002', 'Gaming Keyboard', 'Keyboard', 'Corsair', 'K70 RGB'],
            ['MOU001', 'Wireless Mouse', 'Mouse', 'Logitech', 'MX Master 3'],
            ['MOU002', 'Gaming Mouse', 'Mouse', 'Razer', 'DeathAdder V2'],
            ['TAB001', 'iPad Pro', 'Tablet', 'Apple', 'iPad Pro 12.9"'],
            ['TAB002', 'Surface Pro', 'Tablet', 'Microsoft', 'Surface Pro 8'],
            ['PHO001', 'iPhone', 'Phone', 'Apple', 'iPhone 14'],
            ['PHO002', 'Samsung Galaxy', 'Phone', 'Samsung', 'Galaxy S23'],
            ['CHA001', 'Office Chair', 'Furniture', 'Herman Miller', 'Aeron Chair'],
            ['DES001', 'Standing Desk', 'Furniture', 'IKEA', 'Bekant Desk'],
        ];

        foreach ($equipmentData as $eq) {
            $equipments[] = DB::table('equipments')->insertGetId([
                'equipment_code' => $eq[0],
                'name' => $eq[1],
                'category' => $eq[2],
                'brand' => $eq[3],
                'model' => $eq[4],
                'description' => $eq[1] . ' - ' . $eq[4],
                'status' => 'available',
                'condition' => 'good_condition',
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'purchase_price' => rand(500, 5000),
                'notes' => 'Sample equipment for testing',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create sample requests (NEW REQUESTS - 11 items)
        $requests = [];
        for ($i = 0; $i < 11; $i++) {
            $requests[] = DB::table('requests')->insertGetId([
                'request_number' => 'REQ' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'employee_id' => $employees[array_rand($employees)],
                'equipment_id' => $equipments[array_rand($equipments)],
                'request_type' => ['new_assignment', 'replacement', 'additional'][array_rand([0, 1, 2])],
                'request_mode' => ['on_site', 'work_from_home'][array_rand([0, 1])],
                'status' => 'pending',
                'reason' => 'Work requirement for ' . ['project', 'daily tasks', 'remote work', 'replacement'][array_rand([0, 1, 2, 3])],
                'requested_date' => Carbon::now()->subDays(rand(1, 7)),
                'expected_start_date' => Carbon::now()->addDays(rand(1, 3)),
                'expected_end_date' => Carbon::now()->addDays(rand(30, 365)),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create transactions for CURRENT HOLDER (22 items)
        for ($i = 0; $i < 22; $i++) {
            $employeeId = $employees[array_rand($employees)];
            $equipmentId = $equipments[array_rand($equipments)];
            $requestId = $requests[array_rand($requests)] ?? null;
            
            // Update equipment status to assigned
            DB::table('equipments')->where('id', $equipmentId)->update(['status' => 'assigned']);

            DB::table('transactions')->insert([
                'transaction_number' => 'TXN' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'user_id' => $adminUser,
                'employee_id' => $employeeId,
                'equipment_id' => $equipmentId,
                'request_id' => $requestId,
                'status' => 'released',
                'request_mode' => ['on_site', 'work_from_home'][array_rand([0, 1])],
                'release_condition' => ['good_condition', 'brand_new'][array_rand([0, 1])],
                'release_date' => Carbon::now()->subDays(rand(1, 30)),
                'released_by' => $adminUser,
                'expected_return_date' => Carbon::now()->addDays(rand(30, 180)),
                'release_notes' => 'Equipment released for work use',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create transactions for VERIFY RETURN (6 items)
        for ($i = 0; $i < 6; $i++) {
            $employeeId = $employees[array_rand($employees)];
            $equipmentId = $equipments[array_rand($equipments)];
            $requestId = $requests[array_rand($requests)] ?? null;
            
            // Update equipment status to available
            DB::table('equipments')->where('id', $equipmentId)->update(['status' => 'available']);

            DB::table('transactions')->insert([
                'transaction_number' => 'TXN' . str_pad($i + 23, 6, '0', STR_PAD_LEFT),
                'user_id' => $managerUser,
                'employee_id' => $employeeId,
                'equipment_id' => $equipmentId,
                'request_id' => $requestId,
                'status' => 'returned',
                'request_mode' => ['on_site', 'work_from_home'][array_rand([0, 1])],
                'release_condition' => ['good_condition', 'brand_new'][array_rand([0, 1])],
                'release_date' => Carbon::now()->subDays(rand(30, 60)),
                'released_by' => $adminUser,
                'return_condition' => ['good_condition', 'damaged'][array_rand([0, 1])],
                'return_date' => Carbon::now()->subDays(rand(1, 7)),
                'expected_return_date' => Carbon::now()->subDays(rand(1, 7)),
                'received_by' => $managerUser,
                'release_notes' => 'Equipment was released for work use',
                'return_notes' => 'Equipment returned in ' . ['good condition', 'damaged condition'][array_rand([0, 1])],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Create some additional pending transactions
        for ($i = 0; $i < 5; $i++) {
            $employeeId = $employees[array_rand($employees)];
            $equipmentId = $equipments[array_rand($equipments)];
            $requestId = $requests[array_rand($requests)] ?? null;

            DB::table('transactions')->insert([
                'transaction_number' => 'TXN' . str_pad($i + 29, 6, '0', STR_PAD_LEFT),
                'user_id' => $adminUser,
                'employee_id' => $employeeId,
                'equipment_id' => $equipmentId,
                'request_id' => $requestId,
                'status' => 'pending',
                'request_mode' => ['on_site', 'work_from_home'][array_rand([0, 1])],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        echo "✅ Sample data created successfully!\n";
        echo "📊 Dashboard Metrics:\n";
        echo "   - NEW REQUESTS: 11\n";
        echo "   - CURRENT HOLDER: 22\n";
        echo "   - VERIFY RETURN: 6\n";
    }
}