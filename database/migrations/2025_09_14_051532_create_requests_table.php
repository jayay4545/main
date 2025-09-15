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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee making request
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade'); // Equipment requested
            $table->enum('request_type', ['borrow', 'permanent_assignment', 'maintenance'])->default('borrow');
            $table->enum('request_mode', ['onsite', 'wfh', 'hybrid'])->default('onsite'); // Work mode
            $table->text('reason')->nullable(); // Reason for request
            $table->date('start_date')->nullable(); // When equipment is needed
            $table->date('end_date')->nullable(); // When equipment should be returned
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // Who approved
            $table->timestamp('approved_at')->nullable(); // When approved
            $table->text('approval_notes')->nullable(); // Notes from approver
            $table->text('rejection_reason')->nullable(); // Reason for rejection
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
