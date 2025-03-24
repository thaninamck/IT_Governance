<?php

namespace Database\Seeders;
use App\Models\Setting;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Factories\LayerFactory;
use Database\Factories\SystemFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Setting::insert([
            ['key' => 'password_min_length', 'value' => '12'],
            ['key' => 'password_max_length', 'value' => '20'],
            ['key' => 'password_expiration_days', 'value' => '60'],
            ['key' => 'password_notification_before_expiration', 'value' => '7']
        ]);
        
        $this->call([

            SourceSeeder::class,
    SystemSeeder::class,

            RiskSeeder::class,

            StatusSeeder::class,
            ClientSeeder::class,
            UserSeeder::class,
            MissionSeeder::class,
            ProfileSeeder::class,
            ParticipationSeeder::class,
            
            SubProcessSeeder::class,
            MajorProcessSeeder::class,
            ControlSeeder::class,
        ]);
    }
}
