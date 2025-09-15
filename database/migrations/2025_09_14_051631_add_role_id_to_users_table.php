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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->constrained()->onDelete('set null');
            $table->string('employee_id')->unique()->nullable(); // Employee ID number
            $table->string('position')->nullable(); // Job position/title
            $table->string('department')->nullable(); // Department
            $table->string('phone')->nullable(); // Contact phone
            $table->boolean('is_active')->default(true); // Whether user is active
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'employee_id', 'position', 'department', 'phone', 'is_active']);
        });
    }
};
