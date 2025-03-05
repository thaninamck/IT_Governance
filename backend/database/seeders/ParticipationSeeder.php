<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\Participation;
use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class ParticipationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::count() === 0 || Mission::count() === 0 || Profile::count() === 0) {
            $this->command->warn('⚠️ Il faut d’abord exécuter les autres seeders (Users, Missions, Profiles).');
            return;
        }

        Participation::factory(20)->create();
    }
}
