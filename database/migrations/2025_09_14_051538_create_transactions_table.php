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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained()->onDelete('cascade'); // Related request
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade'); // Equipment involved
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee
            $table->enum('transaction_type', ['issue', 'return', 'transfer', 'maintenance']); // Type of transaction
            $table->enum('status', ['active', 'completed', 'overdue', 'cancelled'])->default('active');
            $table->timestamp('issued_at')->nullable(); // When equipment was issued
            $table->timestamp('returned_at')->nullable(); // When equipment was returned
            $table->date('expected_return_date')->nullable(); // Expected return date
            $table->text('condition_on_issue')->nullable(); // Equipment condition when issued
            $table->text('condition_on_return')->nullable(); // Equipment condition when returned
            $table->text('notes')->nullable(); // Additional transaction notes
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null'); // Who processed the transaction
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
