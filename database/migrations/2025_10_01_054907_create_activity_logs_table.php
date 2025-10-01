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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., 'Updated an Item', 'Added an item', 'Marked Request(s) for Release'
            $table->text('description'); // Detailed description of the action
            $table->string('model_type')->nullable(); // e.g., 'Equipment', 'Request', 'Transaction'
            $table->unsignedBigInteger('model_id')->nullable(); // ID of the affected model
            $table->json('old_values')->nullable(); // Previous values (for updates)
            $table->json('new_values')->nullable(); // New values (for updates)
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
