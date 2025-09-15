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
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->string('equipment_code')->unique(); // Equipment serial number or code
            $table->string('name'); // Equipment name (e.g., "Dell Laptop", "Monitor")
            $table->string('category'); // Category (Laptop, Monitor, Keyboard, etc.)
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'assigned', 'maintenance', 'retired', 'lost'])->default('available');
            $table->enum('condition', ['brand_new', 'good_condition', 'fair', 'poor', 'damaged'])->default('good_condition');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'category']);
            $table->index('equipment_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};
