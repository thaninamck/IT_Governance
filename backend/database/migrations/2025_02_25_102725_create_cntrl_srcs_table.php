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
        Schema::create('cntrl_srcs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('control_id')->constrained('controls');
            $table->foreignId('source_id')->constrained('sources');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cntrl_srcs');
    }
};
