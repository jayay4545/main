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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Laptop", "Monitor", "Mouse"
            $table->string('brand'); // e.g., "Lenovo", "Dell", "ASUS"
            $table->string('model')->nullable(); // Specific model number
            $table->text('specifications')->nullable(); // Technical specs
            $table->string('serial_number')->unique()->nullable(); // Unique serial number
            $table->string('asset_tag')->unique()->nullable(); // Company asset tag
            $table->enum('status', ['available', 'in_use', 'maintenance', 'retired'])->default('available');
            $table->enum('condition', ['excellent', 'good', 'fair', 'poor'])->default('good');
            $table->decimal('purchase_price', 10, 2)->nullable(); // Purchase cost
            $table->date('purchase_date')->nullable(); // When purchased
            $table->date('warranty_expiry')->nullable(); // Warranty end date
            $table->text('notes')->nullable(); // Additional notes
            $table->string('location')->nullable(); // Physical location
            $table->unsignedBigInteger('category_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
