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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'super_admin', 'admin', 'employee'
            $table->string('display_name'); // e.g., 'Super Administrator', 'Administrator', 'Employee'
            $table->text('description')->nullable(); // Role description
            $table->json('permissions')->nullable(); // JSON array of permissions
            $table->boolean('is_active')->default(true); // Whether role is active
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
