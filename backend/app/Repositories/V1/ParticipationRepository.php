<?php

namespace App\Repositories\V1;

use App\Models\Participation;

class ParticipationRepository
{
    public function createParticipation(array $data): Participation
    {
        return Participation::create($data);
    }

     // Mettre à jour un participant
     public function updateParticipation(int $id, array $data): Participation
     {
         $participation = Participation::findOrFail($id);

        //  if (!$participation) {

        //     return null;
        // }
         $participation->update($data);

         return $participation;
     }

    /**
     * Supprime tous les participants associés à une mission
     */
    public function deleteByMissionId(int $missionId): void
    {
        Participation::where('mission_id', $missionId)->delete();
    }
}

