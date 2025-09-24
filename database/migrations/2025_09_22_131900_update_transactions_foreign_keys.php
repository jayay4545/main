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
        // First create equipment_categories table if it doesn't exist
        if (!Schema::hasTable('equipment_categories')) {
            Schema::create('equipment_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        }

        // Create roles table if it doesn't exist
        if (!Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('description')->nullable();
                $table->timestamps();
            });
        }

        Schema::table('transactions', function (Blueprint $table) {
            // Make nullable columns that can be null
            $table->unsignedBigInteger('request_id')->nullable()->change();
            $table->unsignedBigInteger('received_by')->nullable()->change();
            $table->unsignedBigInteger('released_by')->nullable()->change();
            
            // Drop existing foreign keys if they exist
            $table->dropForeign(['request_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['equipment_id']);
            $table->dropForeign(['released_by']);
            $table->dropForeign(['received_by']);

            // Add them back with proper constraints
            $table->foreign('request_id')->references('id')->on('requests')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
            $table->foreign('released_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('received_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Drop the foreign keys
            $table->dropForeign(['request_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['equipment_id']);
            $table->dropForeign(['released_by']);
            $table->dropForeign(['received_by']);

            // Add them back with CASCADE delete
            $table->foreign('request_id')->references('id')->on('requests')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
            $table->foreign('released_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('received_by')->references('id')->on('users')->onDelete('cascade');
        });
    }
};