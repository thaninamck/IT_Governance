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
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID pour correspondre à l'ID généré par Laravel
            $table->morphs('notifiable');

            $table->string('type'); // Type de notification (ex: "App\Notifications\CustomNotification")
            $table->json('data'); // Stockage des données de notification (message, url, etc.)
            $table->timestamp('read_at')->nullable(); // Indique si la notification est lue
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
