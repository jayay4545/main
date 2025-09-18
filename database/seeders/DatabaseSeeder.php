<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategoriesSeeder::class,
            EmployeesSeeder::class,
            RolesSeeder::class,
            UsersSeeder::class,
            EquipmentSeeder::class,
            RequestsSeeder::class,
            TransactionsSeeder::class,
        ]);
    }
}

