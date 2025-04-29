<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\System;
use App\Models\Layer;

class SystemSeeder extends Seeder
{
    public function run(): void
    {
        $systems = System::factory()->count(2)->create(); 

        $layerNames = [
            'Applicative',
            'Bases de données',
            "Système d'exploitation",
            'Procédurale',
            'Sécurité physique & environnementale'
        ];

        foreach ($systems as $system) {
            foreach ($layerNames as $name) {
                Layer::create([
                    'name' => $name,
                    'system_id' => $system->id,
                ]);
            }
        }
    }
}
