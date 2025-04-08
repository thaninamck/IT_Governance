<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Mission;
use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\System;

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
        $missions = Mission::factory(5)->create(); 

        // Récupération de tous les systèmes
        $systems = System::all();

        foreach ($missions as $mission) {
            $randomSystems = $systems->count() > 1 ? $systems->random(min(3, $systems->count())) : $systems;
        
            foreach ($randomSystems as $system) {
                $system->mission_id = $mission->id;
                $system->save();
            }
        }
        
    }
}
