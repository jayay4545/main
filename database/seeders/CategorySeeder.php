<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic items',
                'image' => null,
            ],
            [
                'name' => 'Furniture',
                'description' => 'Office furniture',
                'image' => null,
            ],
            [
                'name' => 'Stationery',
                'description' => 'Office stationery',
                'image' => null,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
