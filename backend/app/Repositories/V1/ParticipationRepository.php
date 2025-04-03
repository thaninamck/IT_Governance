<?php

namespace App\Repositories\V1;

use App\Models\Participation;

class ParticipationRepository
{

    public function findParticipationByMissionAndUserAndProfile(int $missionId, int $userId, int $profileId): ?Participation
    {
        return Participation::where('mission_id', $missionId)
            ->where('user_id', $userId)
            ->where('profile_id', $profileId)
            ->first();
    }

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

    public function findMemberById(int $id)
    {
        return Participation::find($id);
    }
    
public function deleteParticipation(int $id): ?string
{
    $participation =Participation::find($id);
    if (!$participation) {
       
        return null;
    }
    $user_id=$participation->user_id;
    $participation->delete();
    return $user_id;
}
}

