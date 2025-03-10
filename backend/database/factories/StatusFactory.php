<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Status>
 */


class StatusFactory extends Factory
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

        // Liste des statuts d'exécution
        $executionStatuses = [
            'en cours',
            'en attente',
            'applied',
            'not applied',
            'not applicable',
            'not tested',
            'partially applied',
        ];

        
        $allStatuses = array_merge($missionStatuses, $executionStatuses);

        return [
            //'status_name' => $this->faker->randomElement($allStatuses),
        ];
    }
}