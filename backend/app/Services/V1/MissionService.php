<?php

namespace App\Services\V1;

use App\Models\Mission;
use App\Repositories\V1\MissionRepository;

class MissionService
{
    protected MissionRepository $missionRepository;
    protected ParticipationService $participationService;

    public function __construct(MissionRepository $missionRepository, ParticipationService $participationService)
    {
        $this->missionRepository = $missionRepository;
        $this->participationService = $participationService;
    }

    public function getAllMissions()
    {
        return $this->missionRepository->getAllMissions();
    }

    public function createMission(array $data): Mission
    {
        $data['status_id'] = 16;
        return $this->missionRepository->createMission($data);
    }

    public function closeMission(int $id):Mission
    {
        return $this->missionRepository->closeMission($id);
    }
    public function archiveMission(int $id):Mission
    {
        return $this->missionRepository->archiveMission($id);
    }
    public function cancelMission(int $id):Mission
    {
        return $this->missionRepository->cancelMission($id);
    }
    public function stopMission(int $id): array
    {
        return $this->missionRepository->stopMission($id);
    }
    
    public function resumeMission(int $id, int $previousStatusId, string $newStartDate): ?Mission
{
    return $this->missionRepository->resumeMission($id, $previousStatusId, $newStartDate );
}

    public function getArchivedMissions()
{
    return $this->missionRepository->getArchivedMissions();
}

    public function updateMission($id, array $data): ?Mission
    {
        return $this->missionRepository->updateMission($id, $data);
    }

    public function deleteMission(int $id): ?string
    {
        $mission = $this->missionRepository->findMissionById($id);

        if (!$mission) {
            return null;
        }
        // Vérifier si la mission a des relations avec des exécutions ou des remédiations
        if ($this->missionRepository->hasRelatedData($mission)) {
            throw new \Exception("impossible de supprimer cette mission,des données lui sont encore associées.");
        }

        // Supprimer les participants associés à la mission
        $this->participationService->deleteParticipation($mission->id);
        return $this->missionRepository->deleteMission($id);
    }

    public function createMultipleMissions(array $missionsData)
    {
        // foreach($missionsData as $missionData){
        //     $missionData['status_id']= 9;
        // }
        // Ajouter status_id à chaque mission
        $missionsData = array_map(function ($missionData) {
            $missionData['status_id'] = 9; // Définir le statut par défaut
            return $missionData;
        }, $missionsData);

        return $this->missionRepository->createMultipleMissions($missionsData);

        // // Créer les participants pour chaque mission
        // foreach ($createdMissions as $mission) {
        //     $participantData = [
        //         'user_id' => $mission->manager_id, // Utiliser le manager_id de la mission
        //         'mission_id' => $mission->id,
        //         'profile_id' => 3, // ID du profil "manager"
        //     ];

        //     $this->participationService->createParticipation($participantData);
        // }

        return $createdMissions;
    }
}
