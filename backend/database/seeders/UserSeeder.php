<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(10)->create()->each(function ($user) {
            // Assigner une position aléatoire parmi les positions existantes
            $user->position()->associate(Position::inRandomOrder()->first());
            $user->save();
        });
    }
}
