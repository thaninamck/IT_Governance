<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\Participation;
use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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

    // public function run(): void
    // {
    //     if (User::count() === 0 || Mission::count() === 0 || Profile::count() === 0) {
    //         $this->command->warn('⚠️ Il faut d’abord exécuter les autres seeders (Users, Missions, Profiles).');
    //         return;
    //     }

    //     for ($i = 0; $i < 20; $i++) {
    //         $user_id = User::inRandomOrder()->first()->id;
    //         $mission_id = Mission::inRandomOrder()->first()->id;
    //         $profile_id = Profile::inRandomOrder()->first()->id;

    //         // Vérifie si l'enregistrement existe déjà avant d'insérer
    //         if (!DB::table('participations')
    //             ->where('user_id', $user_id)
    //             ->where('mission_id', $mission_id)
    //             ->exists()) 
    //         {
    //             Participation::create([
    //                 'user_id' => $user_id,
    //                 'mission_id' => $mission_id,
    //                 'profile_id' => $profile_id,
    //             ]);
    //         }
    //     }
    // }
}
