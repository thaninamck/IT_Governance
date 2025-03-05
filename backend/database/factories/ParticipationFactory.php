<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Mission;
use App\Models\Profile;
use App\Models\Participation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        do {
            $mission_id = Mission::inRandomOrder()->value('id') ?? Mission::factory()->create()->id;
            $user_id = User::inRandomOrder()->value('id') ?? User::factory()->create()->id;
            $profile_id = Profile::inRandomOrder()->value('id') ?? Profile::factory()->create()->id;

            $exists = Participation::where([
                'mission_id' => $mission_id,
                'user_id' => $user_id,
                'profile_id' => $profile_id,
            ])->exists();

        } while ($exists); 

        return [
            'mission_id' => $mission_id,
            'user_id' => $user_id,
            'profile_id' => $profile_id,
        ];
    }
}
