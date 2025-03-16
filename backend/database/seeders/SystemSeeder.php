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

        foreach ($systems as $system) {  
            Layer::factory()->count(3)->create([
                'system_id' => $system->id
            ]);
        }
    }
}
