<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\missions;
use App\Models\clients;
use App\Models\Status;
use App\Models\statuses;


use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mission>
 */


class MissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Liste des statuts de mission
        $missionStatuses = [
            'archivée',
            'en attente d\'archivage',
            'en attente de suppression',
            'supprimée',
            'en attente d\'annulation',
            'annulée',
            'en attente de clôture',
            'clôturée',
        ];

        // Trouver ou créer un statut de mission aléatoire
        $status = Status::firstOrCreate([
            'status_name' => $this->faker->randomElement($missionStatuses),
            'entity'=> 'mission',
        ]);

        return [
            'status_id' => $status->id, // Utiliser l'ID du statut de mission
            'client_id' => Client::inRandomOrder()->value('id') ?? Client::factory(),
            'mission_name' => $this->faker->sentence(2), // Génère un nom de mission aléatoire
            'start_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+1 year'),

            // La période auditée doit être antérieure à la mission
            'audit_start_date' => $this->faker->dateTimeBetween('-3 years', '-1 year'),
            'audit_end_date' => $this->faker->dateTimeBetween('-1 year', '6 months'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
