<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class StatusSeeder extends Seeder
{
    public function run(): void
    {
        // Liste des statuts à créer
        $statusList = [
            'archivée',
            'en attente d\'archivage',
            'en attente de suppression',
            'supprimée',
            'en attente d\'annulation',
            'annulée',
            'en attente de clôture',
            'clôturée',
            'en cours',
            'en attente',
            'applied',
            'not applied',
            'not applicable',
            'not tested',
            'partially applied',
        ];

        // Créer un statut pour chaque élément de la liste
        foreach ($statusList as $statusName) {
            if (Status::where('status_name', $statusName)->exists()) {
                continue; // Si le statut existe déjà, on passe à l'itération suivante
            }
            Status::create(['status_name' => $statusName]);
        }
    }
}
