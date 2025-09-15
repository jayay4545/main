<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Computers', 'Peripherals', 'Networking'
            $table->string('slug')->unique(); // URL-friendly version
            $table->text('description')->nullable(); // Category description
            $table->string('icon')->nullable(); // Icon class or path
            $table->boolean('is_active')->default(true); // Whether category is active
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_categories');
    }
};
