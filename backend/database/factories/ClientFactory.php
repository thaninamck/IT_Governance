<?php

namespace Database\Factories;
use App\Models\clients;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'commercial_name' => $this->faker->randomElement([
                'Djezzy',
                'Algérie Télécom',
                'Ooredoo',
                'ATM',
                'Aigle Azur',
                'Air Algérie',
                'Tassili Airlines',
            ]),
            'social_reason' => $this->faker->companySuffix,
            'contact_1' => $this->faker->phoneNumber,
            'contact_2' => $this->faker->phoneNumber,
            'address' => $this->faker->address,
            'correspondence' => $this->faker->sentence,
        ];
    }
}
