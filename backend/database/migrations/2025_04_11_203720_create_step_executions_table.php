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
        Schema::create('step_executions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('execution_id')->constrained('executions')->onDelete('cascade');;
            $table->foreignId('step_id')->constrained('step_test_scripts');
            $table->string('comment', 255)->nullable(); 
            $table->boolean('checked',); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('step_executions');
    }
};
