<?php
namespace App\Services\V1;

use App\Models\Participation;
use App\Repositories\V1\ParticipationRepository;
use Illuminate\Support\Facades\Hash;

class ParticipationService
{

    protected ParticipationRepository $participationRepository;

    public function __construct(ParticipationRepository $participationRepository)
    {
        $this->participationRepository = $participationRepository;
    }


    public function createParticipation(array $data): Participation
    {
        return $this->participationRepository->createParticipation($data);
    }

    // Mettre à jour un participant
    public function updateParticipation(int $id, array $data): Participation
    {
        return $this->participationRepository->updateParticipation($id, $data);
    }

     
     //Trouver une participation par mission et profil
    public function findParticipationByMissionAndProfile(int $missionId, int $profileId): ?Participation
    {
        return Participation::where('mission_id', $missionId)
            ->where('profile_id', $profileId)
            ->first();
    }

     /**
     * Supprime tous les participants associés à une mission
     */
    public function deleteParticipation(int $missionId): void
    {
        $this->participationRepository->deleteByMissionId($missionId);
    }
}