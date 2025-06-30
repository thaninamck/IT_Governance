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
        $descriptions = [
            "As a minimum, access to information systems is restricted through the use of a unique username / password combination. This means that no individual has access to more than one account, and there are no generic accounts assigned to individual users. All exceptions (including service accounts or functional accounts) must be risk assessed, justified and periodically reviewed.",
            "Access to information systems is granted through the use of role-based definitions that comply with segregation of duties requirements. Access rights are reviewed on a regular basis to ensure appropriateness.",
            "Critical system configurations and security parameters are regularly reviewed and updated to comply with security standards and best practices.",
            "Regular backups of critical data are performed and tested to ensure data integrity and business continuity in case of incident.",
            "All changes to production systems are authorized, documented, and reviewed as part of a formal change management process.",
            "User activities are logged and monitored to detect and investigate unauthorized or suspicious activities in a timely manner.",
            "Physical and logical access to sensitive environments is restricted to authorized personnel only, based on the principle of least privilege.",
            "A formal incident response plan is established and regularly tested to ensure timely and effective handling of security incidents.",
            "All third-party service providers are evaluated and monitored to ensure they comply with security and confidentiality requirements.",
            "Information security policies are documented, approved, and communicated to all employees to ensure awareness and compliance.",
        ];

        return [
            'code' => sprintf(
                'P%d.%02d.%02d.%s.%d',
                $this->faker->numberBetween(10, 99),
                $this->faker->numberBetween(10, 99),
                $this->faker->numberBetween(1, 31),
                $this->faker->randomLetter(),
                $this->faker->numberBetween(1, 5)
            ),
            'is_archived' => $this->faker->boolean(0),
            'description' => $this->faker->randomElement($descriptions),
            // 'type_id' => Type::factory(),
            // 'major_id' => MajorProcess::factory(),
            // 'sub_id' => SubProcess::factory(),
        ];
    }
}
