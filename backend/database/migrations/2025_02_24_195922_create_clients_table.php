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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('commercial_name', 255)->nullable();
            $table->string('social_reason', 255)->nullable();
            $table->string('contact_1', 255)->nullable();//numero de telephone
            $table->string('contact_2', 255)->nullable();//a confirmer si c un email ou pas 
            $table->string('address', 255)->nullable();
            $table->string('correspondence', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
