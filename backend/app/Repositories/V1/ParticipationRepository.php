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
    public function getmanagerMission($missionID)
{
    // Récupère le premier user_id correspondant à un manager pour cette mission
    return Participation::where('mission_id', $missionID)
        ->whereHas('profile', function ($query) {
            $query->where('profile_name', 'manager');
        })
        ->pluck('user_id') // Récupère un tableau de user_id
        ->first(); // Récupère le premier user_id (ou null si pas trouvé)
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
        $participation = Participation::find($id);
        if (!$participation) {

            return null;
        }
        $user_id = $participation->user_id;
        $participation->delete();
        return $user_id;
    }

    public function getTestersByMissionID($id)
    {
        return Participation::where('mission_id', $id)
            ->whereHas('profile', function ($query) {
                $query->where('profile_name', 'testeur');
            })
            ->pluck('user_id');
    }
}
