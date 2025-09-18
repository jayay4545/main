<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop the table if it exists
        Schema::dropIfExists('equipment_categories');
    }

    public function down()
    {
        // No need for down since we're migrating away from equipment_categories
    }
};