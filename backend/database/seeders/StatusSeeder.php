<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        // Liste des statuts à créer pour chaque entité
        $statuses = [
            'execution' => [
                'applied',
                'not applied',
                'not applicable',
                'not tested',
                'partially applied',
            ],
            'mission' => [
                'non_commencee',
                'en_cours',
            ],
            'remediation' => [
                'Terminé',
                'en cours',
            ],
        ];

        // Exécution des insertions SQL pour chaque entité
        foreach ($statuses as $entity => $statusNames) {
            foreach ($statusNames as $statusName) {
                DB::table('statuses')->insert([
                    'status_name' => $statusName,
                    'entity' => $entity, // Correction ici
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
