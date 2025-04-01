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
    public function run(): void
    {
        if (User::count() === 0 || Mission::count() === 0 || Profile::count() === 0) {
            $this->command->warn('⚠️ Il faut d’abord exécuter les autres seeders (Users, Missions, Profiles).');
            return;
        }

        $users = User::pluck('id')->toArray();
        $missions = Mission::pluck('id')->toArray();
        $profiles = Profile::pluck('id')->toArray();
        $participations = [];

        for ($i = 0; $i < 20; $i++) {
            $user_id = $users[array_rand($users)];
            $mission_id = $missions[array_rand($missions)];
            $profile_id = $profiles[array_rand($profiles)];

            $key = "$user_id-$mission_id"; // Clé unique pour éviter les doublons

            if (!isset($participations[$key]) && 
                !Participation::where('user_id', $user_id)->where('mission_id', $mission_id)->exists()) {
                
                $participations[$key] = [
                    'user_id' => $user_id,
                    'mission_id' => $mission_id,
                    'profile_id' => $profile_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insérer les valeurs uniques
        if (!empty($participations)) {
            Participation::insert(array_values($participations));
        }
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
