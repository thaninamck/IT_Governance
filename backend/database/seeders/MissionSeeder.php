<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Mission;
use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Status::count() === 0 || Client::count() === 0 ) {
            $this->command->warn('⚠️ Il faut d’abord exécuter les autres seeders (clients et statuses).');
            return;
        }
        Mission::factory()->count(10)->create();
    }
}
