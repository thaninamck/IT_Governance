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
        Schema::create('remediation_evidences', function (Blueprint $table) {
            $table->id();
            $table->string('file_name', 255)->nullable();
            $table->foreignId('remediation_id')->nullable()->constrained('remediations','id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remediation_evidences');
    }
};
