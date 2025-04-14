<?php

namespace App\Observers;

use App\Models\Mission;
use Carbon\Carbon;

class MissionObserver
{

     // Statuts gérés par l'Observer
     const MANAGED_STATUSES = [7, 8, 9];
    /**
     * Mettre à jour le statut de la mission lors de la création ou de la mise à jour.
     */

     public function saving(Mission $mission)
     {
         \Log::info('MissionObserver - saving triggered', [
             'mission_id' => $mission->id,
             'original_status' => $mission->getOriginal('status_id'),
             'current_status' => $mission->status_id,
             'start_date' => $mission->start_date,
             'end_date' => $mission->end_date,
         ]);
     
         // 1. Vérifier que les dates sont présentes
         if (empty($mission->start_date)) {
             \Log::warning('MissionObserver - Date de début manquante');
             return;
         }
     
         if (empty($mission->end_date)) {
             \Log::warning('MissionObserver - Date de fin manquante');
             return;
         }
     
         try {
             $currentDate = Carbon::now();
             $startDate = Carbon::parse($mission->start_date);
             $endDate = Carbon::parse($mission->end_date);
     
             // 2. Calculer le nouveau statut
             $newStatus = $this->calculateAutomaticStatus($currentDate, $startDate, $endDate);
     
             // 3. Ne mettre à jour que si le statut change ET si c'est un statut géré
             if ($mission->status_id !== $newStatus && in_array($newStatus, self::MANAGED_STATUSES)) {
                 $mission->status_id = $newStatus;
                 \Log::info('MissionObserver - Statut mis à jour', [
                     'new_status' => $newStatus,
                     'date_comparison' => [
                         'current' => $currentDate,
                         'start' => $startDate,
                         'end' => $endDate
                     ]
                 ]);
             }
         } catch (\Exception $e) {
             \Log::error('MissionObserver - Erreur de traitement', [
                 'error' => $e->getMessage(),
                 'trace' => $e->getTraceAsString()
             ]);
         }
     }

/**
     * Calcule le statut automatique en fonction des dates
     */
    protected function calculateAutomaticStatus(Carbon $currentDate, Carbon $startDate, Carbon $endDate): int
{
    \Log::debug('🔍 Calcul du statut automatique', [
        'current_date' => $currentDate,
        'start_date' => $startDate,
        'end_date' => $endDate,
    ]);

    if ($currentDate->lessThan($startDate)) {
        \Log::info('Statut calculé : Non commencée (7)');
        return 7;
    }

    if ($currentDate->greaterThan($endDate)) {
        \Log::info('Statut calculé : En retard (9)');
        return 9;
    }

    \Log::info('Statut calculé : En cours (8)');
    return 8;
}

    // public function saving(Mission $mission)
    // {

    //     \Log::info('MissionObserver - saving triggered', [
    //         'mission_id' => $mission->id,
    //         'start_date' => $mission->start_date,
    //         'end_date' => $mission->end_date,
    //         'status_id_before' => $mission->status_id,
    //     ]);
        
    //     // Liste des statuts que l'Observer doit gérer
    //     $managedStatuses = [7,8,9];

    //     // Si le statut actuel n'est pas dans la liste des statuts gérés, on ne fait rien
    //     if (!in_array($mission->status_id, $managedStatuses)) {
    //         return;
    //     }

    //     $currentDate = Carbon::now();
    //     $startDate = Carbon::parse($mission->start_date);
    //     $endDate = Carbon::parse($mission->end_date);

    //     if ($currentDate < $startDate) {
    //         $mission->status_id = 7; // Non commencée
    //     } elseif ($currentDate >= $startDate && $currentDate <= $endDate) {
    //         $mission->status_id = 8; // En cours
    //     } elseif ($currentDate > $endDate) {
    //         $mission->status_id = 9; // En retard
    //     }
    // }

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