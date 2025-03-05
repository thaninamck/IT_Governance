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
        Schema::create('cntrl_risk_covs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_id')->constrained('risks');
            $table->foreignId('layer_id')->constrained('layers');
            $table->foreignId('control_id')->constrained('controls');
            $table->string('risk_owner', 255)->nullable();
            $table->string('risk_modification', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cntrl_risk_covs');
    }
};
