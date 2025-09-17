<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the enum to include 'active' status
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'active', 'released', 'returned', 'lost', 'damaged') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'released', 'returned', 'lost', 'damaged') NOT NULL");
    }
};