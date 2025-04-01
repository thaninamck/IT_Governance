<?php

namespace App\Observers;

use App\Models\Mission;
use Carbon\Carbon;

class MissionObserver
{
    /**
     * Mettre à jour le statut de la mission lors de la création ou de la mise à jour.
     */
    public function saving(Mission $mission)
    {
        // Liste des statuts que l'Observer doit gérer
        $managedStatuses = [16, 9, 17];

        // Si le statut actuel n'est pas dans la liste des statuts gérés, on ne fait rien
        if (!in_array($mission->status_id, $managedStatuses)) {
            return;
        }

        $currentDate = Carbon::now();
        $startDate = Carbon::parse($mission->start_date);
        $endDate = Carbon::parse($mission->end_date);

        if ($currentDate < $startDate) {
            $mission->status_id = 16; // Non commencée
        } elseif ($currentDate >= $startDate && $currentDate <= $endDate) {
            $mission->status_id = 9; // En cours
        } elseif ($currentDate > $endDate) {
            $mission->status_id = 17; // En retard
        }
    }

    /**
     * Handle the Mission "created" event.
     */
    public function created(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "updated" event.
     */
    public function updated(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "deleted" event.
     */
    public function deleted(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "restored" event.
     */
    public function restored(Mission $mission): void
    {
        //
    }

    /**
     * Handle the Mission "force deleted" event.
     */
    public function forceDeleted(Mission $mission): void
    {
        //
    }
}