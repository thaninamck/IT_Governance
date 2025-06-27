<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\MajorProcess;

class MajorProcessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            ['code' => 'P15.22', 'description' => 'IT General Controls'],
            ['code' => 'P15.23', 'description' => 'Gestion des changements'],
            ['code' => 'P15.24', 'description' => 'Gestion des incidents'],
            ['code' => 'P15.25', 'description' => 'Gestion des configurations'],
            ['code' => 'P15.26', 'description' => 'Gestion des opérations'],
        ];

        foreach ($majors as $major) {
            MajorProcess::firstOrCreate([
                'code' => $major['code'],
                'description' => $major['description'],
            ]);
        }
    }
}
