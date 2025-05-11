<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->foreignId('previous_status_id')->nullable()->constrained('statuses');
        });
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table) {
            $table->dropForeign(['previous_status_id']);
            $table->dropColumn('previous_status_id');
        });
    }
};
