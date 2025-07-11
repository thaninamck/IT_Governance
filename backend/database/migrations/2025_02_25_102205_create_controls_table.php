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
        Schema::create('controls', function (Blueprint $table) {
            $table->id();
            $table->string('code', 255);
            $table->text('description');

            $table->boolean('is_archived');
            $table->foreignId('type_id')->constrained('types');
            $table->foreignId('major_id')->constrained('major_processes');
            $table->foreignId('sub_id')->constrained('sub_processes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('controls');
    }
};
