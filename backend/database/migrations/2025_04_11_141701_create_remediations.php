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
        Schema::create('remediations', function (Blueprint $table) {
            $table->id();
            $table->string('description', 255)->nullable(); 
            $table->string('owner_cntct', 255); 
            $table->string('follow_up', 255)->nullable(); // Suivi de la remédiation
            $table->foreignId('execution_id')->constrained('executions');
            

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remediations');
    }
};
