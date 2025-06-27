<?php

namespace Database\Seeders;

use App\Models\SubProcess;
use Illuminate\Database\Seeder;

class SubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subs = [
            ['code' => 'P15.22.06', 'name' => 'Identification, Authentication and Access'],
            ['code' => 'P15.22.07', 'name' => 'User Account Management'],
            ['code' => 'P15.22.03', 'name' => 'Testing of Changes'],
        ];

        foreach ($subs as $sub) {
            SubProcess::firstOrCreate([
                'code' => $sub['code'],
                'name' => $sub['name'],
            ]);
        }
    }
}
