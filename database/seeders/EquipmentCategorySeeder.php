<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Computers',
                'slug' => 'computers',
                'description' => 'Desktop computers, laptops, and workstations',
                'icon' => 'laptop',
                'is_active' => true,
            ],
            [
                'name' => 'Peripherals',
                'slug' => 'peripherals',
                'description' => 'Keyboards, mice, monitors, and other computer accessories',
                'icon' => 'mouse',
                'is_active' => true,
            ],
            [
                'name' => 'Networking',
                'slug' => 'networking',
                'description' => 'Routers, switches, cables, and networking equipment',
                'icon' => 'wifi',
                'is_active' => true,
            ],
            [
                'name' => 'Mobile Devices',
                'slug' => 'mobile-devices',
                'description' => 'Smartphones, tablets, and mobile accessories',
                'icon' => 'smartphone',
                'is_active' => true,
            ],
            [
                'name' => 'Audio/Video',
                'slug' => 'audio-video',
                'description' => 'Speakers, microphones, cameras, and AV equipment',
                'icon' => 'camera',
                'is_active' => true,
            ],
            [
                'name' => 'Office Equipment',
                'slug' => 'office-equipment',
                'description' => 'Printers, scanners, projectors, and office machines',
                'icon' => 'printer',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\EquipmentCategory::create($category);
        }
    }
}
