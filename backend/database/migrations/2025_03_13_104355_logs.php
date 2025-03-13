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
        Schema::create('logs', function (Blueprint $table) {
            $table->id(); // Identifiant unique du log
            $table->string('user_email')->nullable(); // Email de l'utilisateur
            $table->string('profile')->nullable(); // Profil de l'utilisateur (Admin, Manager, etc.)
            $table->string('event'); // Description de l'action (ex: "Suppression d'une couche")
            $table->string('mission')->nullable(); // Mission associée (optionnel)
            $table->string('mac_address')->nullable(); // Adresse MAC (optionnel)
            $table->timestamps(); // created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
