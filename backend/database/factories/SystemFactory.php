<?php
namespace Database\Factories;

use App\Models\System; 
use App\Models\Owner;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Mission;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\System>
 */
class SystemFactory extends Factory
{
    protected $model = System::class; 

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['USSD', 'CV360', 'pg']),
            'description' => $this->faker->sentence,
            'owner_id' => Owner::factory(), 
            'mission_id'=>Mission::factory(),
        ];
    }
}
