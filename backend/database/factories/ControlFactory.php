<?php

namespace Database\Factories;
use App\Models\Type;
use App\Models\MajorProcess;
use App\Models\SubProcess;


use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Control>
 */
class ControlFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->bothify('CTRL-###'),
            'is_archived' => $this->faker->boolean(0),
'description' => $this->faker->text(255),
            'type_id' => Type::factory(), 
            'major_id' => MajorProcess::factory(),
            'sub_id' => SubProcess::factory(),

        ];
    }
}
