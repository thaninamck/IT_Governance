<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('executions', function (Blueprint $table) {
            $table->id();
            $table->string('cntrl_modification', 255)->nullable();
            $table->string('comment', 255)->nullable();
            $table->string('control_owner', 255)->nullable();
             $table->date('launched_at')->nullable();
            $table->boolean('ipe')->default(false);
            $table->boolean('effectiveness')->default(false);
            $table->boolean('design')->default(false);
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('control_id')->constrained('controls');
            $table->foreignId('status_id')->constrained('statuses')->nullable();
            $table->foreignId('layer_id')->constrained('layers');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('executions');
    }
};
