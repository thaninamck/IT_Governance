<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->randomElement(['Zouaghi','Koliai','Ouakli','Labsi','Hafri','Toubal','El Maouhab','Lounas']),
            'last_name' => fake()->randomElement(['Azyadi','Lotfi','Adel','Karim','Sif Ali','Kamelia','Houda','Sara']),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'grade' => fake()->randomElement(['junior1', 'junior2', 'directeur IT','senior2','senior1','manager','assistant manager','senior manager']),
            'is_active' => fake()->boolean(),
            'last_activity' => fake()->dateTime(),
            'role' => fake()->randomElement(['0']),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
