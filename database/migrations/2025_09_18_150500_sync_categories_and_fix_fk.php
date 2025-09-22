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
        // If equipment_categories exists, migrate rows into categories
        if (Schema::hasTable('equipment_categories') && Schema::hasTable('categories')) {
            $mapping = [];
            $rows = DB::table('equipment_categories')->get();
            foreach ($rows as $row) {
                // Insert into categories if not exists by name
                $existing = DB::table('categories')->where('name', $row->name)->first();
                if ($existing) {
                    $mapping[$row->id] = $existing->id;
                } else {
                    $newId = DB::table('categories')->insertGetId([
                        'name' => $row->name,
                        'description' => $row->description ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $mapping[$row->id] = $newId;
                }
            }

            // Update equipment.category_id values from old ids to new ids
            foreach ($mapping as $oldId => $newId) {
                DB::table('equipment')->where('category_id', $oldId)->update(['category_id' => $newId]);
            }
        }

        // Replace foreign key on equipment.category_id to reference categories.id
        if (Schema::hasTable('equipment') && Schema::hasColumn('equipment', 'category_id')) {
            // drop existing foreign if present
            try {
                Schema::table('equipment', function (Blueprint $table) {
                    $table->dropForeign(['category_id']);
                });
            } catch (\Exception $e) {
                // ignore if foreign doesn't exist
            }

            // add foreign to categories
            try {
                Schema::table('equipment', function (Blueprint $table) {
                    $table->foreign('category_id')->references('id')->on('categories')->onDelete('SET NULL');
                });
            } catch (\Exception $e) {
                // ignore errors
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Attempt to restore foreign key to equipment_categories if that table exists
        if (Schema::hasTable('equipment') && Schema::hasColumn('equipment', 'category_id') && Schema::hasTable('equipment_categories')) {
            try {
                Schema::table('equipment', function (Blueprint $table) {
                    $table->dropForeign(['category_id']);
                });
            } catch (\Exception $e) {
            }

            try {
                Schema::table('equipment', function (Blueprint $table) {
                    $table->foreign('category_id')->references('id')->on('equipment_categories')->onDelete('SET NULL');
                });
            } catch (\Exception $e) {
            }
        }
    }
};
