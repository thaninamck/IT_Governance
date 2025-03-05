<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            StatusSeeder::class,
            ClientSeeder::class,
            UserSeeder::class,
            MissionSeeder::class,
            ProfileSeeder::class,
            ParticipationSeeder::class,
            
        ]);
    }
}
