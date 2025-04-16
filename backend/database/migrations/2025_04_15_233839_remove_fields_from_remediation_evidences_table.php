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
        Schema::table('remediation_evidences', function (Blueprint $table) {
            // Supprimer la contrainte de clé étrangère avant de supprimer la colonne
            $table->dropForeign(['status_id']);
            $table->dropColumn(['start_date', 'end_date', 'status_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remediation_evidences', function (Blueprint $table) {
          
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('status_id')->nullable()->constrained('statuses');
        });
    }
};
