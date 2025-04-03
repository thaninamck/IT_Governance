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

    public function getMembersByMission($missionId)
{
    $mission = $this->missionRepository->getMembersByMission($missionId);

    if (!$mission) {
        return null; // ou lancer une exception
    }

    return [
        'id' => $mission->id,
        'mission_name' => $mission->mission_name,
        'start_date' => $mission->start_date,
        'end_date' => $mission->end_date,
        'client_id' => $mission->client_id,
        'clientName' => $mission->client->commercial_name,
        'status_id' => $mission->status_id,
        'members' => $mission->participations->map(function ($participation) {
            return [
                'id' => $participation->id,
                'userId'=>$participation->user->id,
                'first_name' => $participation->user->first_name,
                'last_name' => $participation->user->last_name,
                'full_name' => $participation->user->first_name . ' ' . $participation->user->last_name,
                'email' => $participation->user->email,
                'profile' => [
                    'id' => $participation->profile->id,
                    'profile_name' => $participation->profile->profile_name
                ]
            ];
        })->toArray()
    ];
}

public function getSystemsByMissionID($missionId)
{
    // Chargez la mission avec les systèmes et leurs relations
    $mission = $this->missionRepository->getSystemsByMissionID($missionId)
    ->load(['systems.layers', 'systems.owner']);

    if (!$mission) {
        return null; // ou lancer une exception
    }

     

    return [
        'id' => $mission->id,
        'mission_name' => $mission->mission_name,
        'systems' => $mission->systems->map(function ($system) {
            return [
                'id' => $system->id,
                'name' => $system->name,
                'description' => $system->description,
                'ownerId'=>$system->owner->id,
                'ownerName'=>$system->owner->full_name,
                'ownerContact' => $system->owner->email,
                'layers' => $system->layers->map(function ($layer) {
                    return [
                        'id' => $layer->id,
                        'name' => $layer->name
                    ];
                })->toArray()
            ];
        })->toArray()
    ];
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


    public function getUserMissions($userId)
{
    $missions = $this->missionRepository->getUserMissions($userId);

    return $missions->map(function ($mission) use ($userId) {
        // Trouver la participation de l'utilisateur courant
        $userParticipation = $mission->participations->firstWhere('user_id', $userId);
        $profile_name=$userParticipation->profile;
        
        return [
            'id' => $mission->id,
            'missionName' => $mission->mission_name,
            'clientId' => $mission->client_id,
            'clientName' => $mission->client->commercial_name,
            'startDate' => $mission->start_date,
            'endDate' => $mission->end_date,
            'auditStartDate' => $mission->audit_start_date,
            'auditEndDate' => $mission->audit_end_date,
            'statusId' => $mission->status_id,
            'status' => $mission->status->status_name,
            'profileName' => $profile_name->profile_name,
            // Conserver les autres participations si nécessaire
            // 'participations' => $mission->participations->map(function ($participation) {
            //     return [
            //         'profile' => [
            //             'id' => $participation->profile->id,
            //             'profileName' => $participation->profile->profile_name
            //         ]
            //     ];
            // })->toArray()
        ];
    })->toArray();
}
}
