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
        Schema::create('evidences', function (Blueprint $table) {
            $table->id();
            $table->string('file_name', 255)->nullable();
            $table->boolean('is_f_test')->default(false);
            $table->foreignId('execution_id')->nullable()->constrained('executions','id');
            $table->foreignId('remediation_id')->nullable()->constrained('remediations');

            $table->timestamps();//pour insered_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evidences');
    }
};
