<?php

require_once 'vendor/autoload.php';

use App\Services\ActivityLogService;
use App\Models\User;
use App\Models\Equipment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing Activity Log System\n";
echo "==========================\n\n";

// Test 1: Create a system activity log
echo "1. Testing system activity log...\n";
try {
    $log = ActivityLogService::logSystemActivity(
        'System maintenance',
        'Testing activity log system functionality'
    );
    echo "✓ System activity log created with ID: {$log->id}\n";
} catch (Exception $e) {
    echo "✗ Error creating system activity log: " . $e->getMessage() . "\n";
}

// Test 2: Get activity logs
echo "\n2. Testing activity logs retrieval...\n";
try {
    $logs = ActivityLogService::getActivityLogsForApi(null, null, null, 30, 5);
    echo "✓ Retrieved " . count($logs['data']) . " activity logs\n";
    echo "  Total logs: {$logs['pagination']['total']}\n";
} catch (Exception $e) {
    echo "✗ Error retrieving activity logs: " . $e->getMessage() . "\n";
}

// Test 3: Test API endpoint
echo "\n3. Testing API endpoint...\n";
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/activity-logs');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        echo "✓ API endpoint working - retrieved " . count($data['data']) . " logs\n";
    } else {
        echo "✗ API endpoint returned HTTP {$httpCode}\n";
    }
} catch (Exception $e) {
    echo "✗ Error testing API endpoint: " . $e->getMessage() . "\n";
}

echo "\nActivity Log System Test Complete!\n";
