<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Risk>
 */
class RiskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "code" => $this->faker->numberBetween(1, 100),
            "name" => $this->faker->randomElement(["Risk1", "Risk2", "Risk3", "Risk4"]),
            "description" => $this->faker->randomElement([
                "This is a test description.",
                "Another example of a description.",
                "A randomly chosen description.",
                "Yet another sample text."
            ]),
        ];
    }
    
}
