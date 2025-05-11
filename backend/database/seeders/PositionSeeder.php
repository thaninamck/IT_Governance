<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            'Stagiaire',
            'Junior 1',
            'Junior 2',
            'Senior 1',
            'Senior 2',
            'Manager',
            'Senior Manager',
            'Assistant Manager',
            'Directeur IT',
        ];

        foreach ($grades as $name) {
            Position::create(['name' => $name]);
        }
    
    }
}
