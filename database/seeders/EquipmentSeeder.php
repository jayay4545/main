<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Carbon\Carbon;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories
        $computersCategory = EquipmentCategory::where('slug', 'computers')->first();
        $peripheralsCategory = EquipmentCategory::where('slug', 'peripherals')->first();
        $networkingCategory = EquipmentCategory::where('slug', 'networking')->first();
        $mobileCategory = EquipmentCategory::where('slug', 'mobile-devices')->first();
        $audioVideoCategory = EquipmentCategory::where('slug', 'audio-video')->first();
        $officeCategory = EquipmentCategory::where('slug', 'office-equipment')->first();

        $equipmentData = [
            // Laptops & Computers
            [
                'name' => 'Dell Latitude 5520',
                'brand' => 'Dell',
                'model' => 'Latitude 5520',
                'specifications' => 'Intel Core i7-1185G7, 16GB RAM, 512GB SSD, 15.6" FHD Display',
                'serial_number' => 'DL5520' . rand(100000, 999999),
                'asset_tag' => 'LAP001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 1299.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 18)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(6, 24)),
                'notes' => 'Business laptop for office use',
                'location' => 'IT Storage Room',
                'category_id' => $computersCategory->id,
            ],
            [
                'name' => 'HP EliteBook 840 G8',
                'brand' => 'HP',
                'model' => 'EliteBook 840 G8',
                'specifications' => 'Intel Core i5-1135G7, 8GB RAM, 256GB SSD, 14" FHD Display',
                'serial_number' => 'HP840G8' . rand(100000, 999999),
                'asset_tag' => 'LAP002',
                'status' => 'available',
                'condition' => 'good',
                'purchase_price' => 1099.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 36)),
                'notes' => 'Lightweight business laptop',
                'location' => 'IT Storage Room',
                'category_id' => $computersCategory->id,
            ],
            [
                'name' => 'MacBook Pro 13"',
                'brand' => 'Apple',
                'model' => 'MacBook Pro 13" M1',
                'specifications' => 'Apple M1 Chip, 8GB RAM, 256GB SSD, 13.3" Retina Display',
                'serial_number' => 'MBP13M1' . rand(100000, 999999),
                'asset_tag' => 'LAP003',
                'status' => 'in_use',
                'condition' => 'excellent',
                'purchase_price' => 1299.00,
                'purchase_date' => Carbon::now()->subMonths(rand(6, 18)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Development machine for iOS development',
                'location' => 'Development Lab',
                'category_id' => $computersCategory->id,
            ],
            [
                'name' => 'Lenovo ThinkPad X1 Carbon',
                'brand' => 'Lenovo',
                'model' => 'ThinkPad X1 Carbon Gen 9',
                'specifications' => 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 14" 4K Display',
                'serial_number' => 'TPX1C9' . rand(100000, 999999),
                'asset_tag' => 'LAP004',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 1599.99,
                'purchase_date' => Carbon::now()->subMonths(rand(3, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(18, 36)),
                'notes' => 'Premium business laptop',
                'location' => 'IT Storage Room',
                'category_id' => $computersCategory->id,
            ],

            // Monitors
            [
                'name' => 'Dell UltraSharp 24"',
                'brand' => 'Dell',
                'model' => 'U2422H',
                'specifications' => '24" IPS, 1920x1080, USB-C, HDMI, DisplayPort',
                'serial_number' => 'DU2422H' . rand(100000, 999999),
                'asset_tag' => 'MON001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 299.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 36)),
                'notes' => 'Professional monitor for office use',
                'location' => 'IT Storage Room',
                'category_id' => $peripheralsCategory->id,
            ],
            [
                'name' => 'Samsung 27" 4K Monitor',
                'brand' => 'Samsung',
                'model' => 'U28R550U',
                'specifications' => '27" 4K UHD, 3840x2160, HDMI, DisplayPort, USB Hub',
                'serial_number' => 'SU28R550' . rand(100000, 999999),
                'asset_tag' => 'MON002',
                'status' => 'available',
                'condition' => 'good',
                'purchase_price' => 399.99,
                'purchase_date' => Carbon::now()->subMonths(rand(2, 18)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'High-resolution monitor for design work',
                'location' => 'Design Studio',
                'category_id' => $peripheralsCategory->id,
            ],

            // Keyboards & Mice
            [
                'name' => 'Logitech MX Keys',
                'brand' => 'Logitech',
                'model' => 'MX Keys',
                'specifications' => 'Wireless, Backlit, Multi-device connectivity',
                'serial_number' => 'LMXK' . rand(100000, 999999),
                'asset_tag' => 'KEY001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 99.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Premium wireless keyboard',
                'location' => 'IT Storage Room',
                'category_id' => $peripheralsCategory->id,
            ],
            [
                'name' => 'Logitech MX Master 3',
                'brand' => 'Logitech',
                'model' => 'MX Master 3',
                'specifications' => 'Wireless, Ergonomic, 70-day battery life',
                'serial_number' => 'LMXM3' . rand(100000, 999999),
                'asset_tag' => 'MOU001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 99.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Premium wireless mouse',
                'location' => 'IT Storage Room',
                'category_id' => $peripheralsCategory->id,
            ],

            // Networking Equipment
            [
                'name' => 'Cisco Catalyst 2960 Switch',
                'brand' => 'Cisco',
                'model' => 'WS-C2960-24TC-L',
                'specifications' => '24-port 10/100, 2 Gigabit uplinks, Layer 2',
                'serial_number' => 'CC2960' . rand(100000, 999999),
                'asset_tag' => 'SWI001',
                'status' => 'available',
                'condition' => 'good',
                'purchase_price' => 299.99,
                'purchase_date' => Carbon::now()->subMonths(rand(6, 24)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 36)),
                'notes' => 'Office network switch',
                'location' => 'Server Room',
                'category_id' => $networkingCategory->id,
            ],
            [
                'name' => 'Ubiquiti UniFi AP AC Pro',
                'brand' => 'Ubiquiti',
                'model' => 'UAP-AC-PRO',
                'specifications' => '802.11ac, 3x3 MIMO, PoE, 122m range',
                'serial_number' => 'UUAPAC' . rand(100000, 999999),
                'asset_tag' => 'WAP001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 149.99,
                'purchase_date' => Carbon::now()->subMonths(rand(3, 18)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'WiFi access point for office',
                'location' => 'IT Storage Room',
                'category_id' => $networkingCategory->id,
            ],

            // Mobile Devices
            [
                'name' => 'iPhone 14',
                'brand' => 'Apple',
                'model' => 'iPhone 14',
                'specifications' => '128GB, A15 Bionic, 6.1" Super Retina XDR',
                'serial_number' => 'IPH14' . rand(100000, 999999),
                'asset_tag' => 'PHO001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 799.00,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Company mobile device',
                'location' => 'IT Storage Room',
                'category_id' => $mobileCategory->id,
            ],
            [
                'name' => 'iPad Pro 12.9"',
                'brand' => 'Apple',
                'model' => 'iPad Pro 12.9" M2',
                'specifications' => '256GB, M2 Chip, 12.9" Liquid Retina XDR',
                'serial_number' => 'IPADP12' . rand(100000, 999999),
                'asset_tag' => 'TAB001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 1099.00,
                'purchase_date' => Carbon::now()->subMonths(rand(2, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Tablet for presentations and field work',
                'location' => 'IT Storage Room',
                'category_id' => $mobileCategory->id,
            ],

            // Audio/Video Equipment
            [
                'name' => 'Logitech C920 HD Pro Webcam',
                'brand' => 'Logitech',
                'model' => 'C920 HD Pro',
                'specifications' => '1080p HD, Auto-focus, Built-in stereo mics',
                'serial_number' => 'LC920' . rand(100000, 999999),
                'asset_tag' => 'CAM001',
                'status' => 'available',
                'condition' => 'excellent',
                'purchase_price' => 69.99,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 18)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'HD webcam for video conferencing',
                'location' => 'IT Storage Room',
                'category_id' => $audioVideoCategory->id,
            ],
            [
                'name' => 'Jabra Speak 710',
                'brand' => 'Jabra',
                'model' => 'Speak 710',
                'specifications' => '360° sound, Bluetooth, USB, 15-hour battery',
                'serial_number' => 'JSP710' . rand(100000, 999999),
                'asset_tag' => 'SPK001',
                'status' => 'available',
                'condition' => 'good',
                'purchase_price' => 199.99,
                'purchase_date' => Carbon::now()->subMonths(rand(2, 12)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 24)),
                'notes' => 'Portable speakerphone for meetings',
                'location' => 'Conference Room',
                'category_id' => $audioVideoCategory->id,
            ],

            // Office Equipment
            [
                'name' => 'HP LaserJet Pro M404dn',
                'brand' => 'HP',
                'model' => 'LaserJet Pro M404dn',
                'specifications' => 'Monochrome laser, 38 ppm, Duplex, Network',
                'serial_number' => 'HPM404' . rand(100000, 999999),
                'asset_tag' => 'PRT001',
                'status' => 'available',
                'condition' => 'good',
                'purchase_price' => 199.99,
                'purchase_date' => Carbon::now()->subMonths(rand(6, 24)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(12, 36)),
                'notes' => 'Office laser printer',
                'location' => 'Print Room',
                'category_id' => $officeCategory->id,
            ],
            [
                'name' => 'Epson WorkForce Pro WF-3720',
                'brand' => 'Epson',
                'model' => 'WorkForce Pro WF-3720',
                'specifications' => 'All-in-one, Wireless, Duplex, 25 ppm',
                'serial_number' => 'EWF3720' . rand(100000, 999999),
                'asset_tag' => 'PRT002',
                'status' => 'maintenance',
                'condition' => 'fair',
                'purchase_price' => 149.99,
                'purchase_date' => Carbon::now()->subMonths(rand(12, 36)),
                'warranty_expiry' => Carbon::now()->subMonths(rand(1, 6)),
                'notes' => 'All-in-one printer - needs maintenance',
                'location' => 'Maintenance Room',
                'category_id' => $officeCategory->id,
            ],
        ];

        foreach ($equipmentData as $equipment) {
            Equipment::create($equipment);
        }

        // Create additional random equipment for more variety
        $brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'LG', 'ASUS', 'Acer'];
        $laptopModels = ['Inspiron', 'Pavilion', 'ThinkPad', 'MacBook Air', 'Galaxy Book', 'Gram', 'ZenBook', 'Swift'];
        $monitorModels = ['UltraSharp', 'EliteDisplay', 'ThinkVision', 'Studio Display', 'Odyssey', 'UltraFine', 'ProArt', 'VX'];
        
        $usedAssetTags = Equipment::pluck('asset_tag')->toArray();
        $usedSerialNumbers = Equipment::pluck('serial_number')->toArray();
        
        for ($i = 0; $i < 20; $i++) {
            $brand = $brands[array_rand($brands)];
            $isLaptop = rand(0, 1);
            
            if ($isLaptop) {
                $model = $laptopModels[array_rand($laptopModels)];
                $name = $brand . ' ' . $model;
                $specs = 'Intel Core i5, 8GB RAM, 256GB SSD, 14" Display';
                $price = rand(800, 1500);
                $prefix = 'LAP';
            } else {
                $model = $monitorModels[array_rand($monitorModels)];
                $name = $brand . ' ' . $model . ' 24"';
                $specs = '24" IPS, 1920x1080, HDMI, DisplayPort';
                $price = rand(200, 400);
                $prefix = 'MON';
            }

            // Generate unique asset tag (avoid duplicates)
            do {
                $assetTag = $prefix . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);
            } while (in_array($assetTag, $usedAssetTags));
            $usedAssetTags[] = $assetTag;

            // Generate unique serial number
            do {
                $serialNumber = strtoupper(substr($brand, 0, 2)) . rand(100000, 999999);
            } while (in_array($serialNumber, $usedSerialNumbers));
            $usedSerialNumbers[] = $serialNumber;

            Equipment::create([
                'name' => $name,
                'brand' => $brand,
                'model' => $model,
                'specifications' => $specs,
                'serial_number' => $serialNumber,
                'asset_tag' => $assetTag,
                'status' => ['available', 'in_use', 'maintenance'][array_rand([0, 1, 2])],
                'condition' => ['excellent', 'good', 'fair'][array_rand([0, 1, 2])],
                'purchase_price' => $price,
                'purchase_date' => Carbon::now()->subMonths(rand(1, 24)),
                'warranty_expiry' => Carbon::now()->addMonths(rand(6, 36)),
                'notes' => 'Additional equipment for office use',
                'location' => ['IT Storage Room', 'Office Floor', 'Conference Room'][array_rand([0, 1, 2])],
                'category_id' => $isLaptop ? $computersCategory->id : $peripheralsCategory->id,
            ]);
        }

        echo "✅ Equipment seeded successfully!\n";
        echo "📊 Created " . count($equipmentData) . " specific equipment items\n";
        echo "📊 Created 20 additional random equipment items\n";
    }
}
