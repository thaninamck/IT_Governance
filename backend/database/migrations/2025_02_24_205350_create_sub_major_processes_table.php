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
        Schema::create('sub_major_processes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('major_process_id')->constrained('major_processes');
            $table->foreignId('sub_process_id')->constrained('sub_processes');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_major_processes');
    }
};
