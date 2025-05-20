<?php

namespace App\Services\V1;

use App\Models\Mission;
use App\Models\Status;
use App\Models\User;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\StatusRepository;
use Illuminate\Support\Facades\Log;

class MissionService
{
    protected MissionRepository $missionRepository;
    protected StatusRepository $statusRepository;
    protected ParticipationService $participationService;


    public function __construct(MissionRepository $missionRepository, ParticipationService $participationService,StatusRepository $statusRepository)
    {
        $this->missionRepository = $missionRepository;
        $this->participationService = $participationService;
        $this->statusRepository= $statusRepository;
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
        'auditStartDate' => $mission->audit_start_date,
        'auditEndDate' => $mission->audit_end_date,
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

// public function getSystemsByMissionID($missionId)
// {
//     // Chargez la mission avec les systèmes et leurs relations
//     $mission = $this->missionRepository->getSystemsByMissionID($missionId)
//     ->load(['systems.layers', 'systems.owner']);

//     if (!$mission) {
//         return null; // ou lancer une exception
//     }
    

//     return response()->json([
//         'systems' => $mission->systems->map(function ($system) use ($mission) {
//             return [
//                 'missionId' => $mission->id,
//                 'missionName' => $mission->mission_name,
//                 'id' => $system->id,
//                 'name' => $system->name,
//                 'description' => $system->description,
//                 'ownerId' => $system->owner->id ?? null,
//                 'ownerName' => $system->owner->full_name ?? null,
//                 'ownerContact' => $system->owner->email ?? null,
//                 'layers' => $system->layers->map(function ($layer) {
//                     return [
//                         'id' => $layer->id,
//                         'name' => $layer->name
//                     ];
//                 })->toArray()
//             ];
//         })->toArray()
//     ]);
// }

public function getSystemsByMissionIDforOption($missionId)
{
    // Chargez la mission avec les systèmes et leurs relations
    $mission = $this->missionRepository->getSystemsByMissionID($missionId)
    ->load(['systems.layers', 'systems.owner']);

    if (!$mission) {
        return null; // ou lancer une exception
    }
    

    return response()->json([
        'systems' => $mission->systems->map(function ($system) use ($mission) {
            return [
                'missionId' => $mission->id,
                'missionName' => $mission->mission_name,
                'id' => $system->id,
                'name' => $system->name,
                'description' => $system->description,
                'ownerId' => $system->owner->id ?? null,
                'ownerName' => $system->owner->full_name ?? null,
                'ownerContact' => $system->owner->email ?? null,
                'layers' => $system->layers->map(function ($layer) {
                    return [
                        'id' => $layer->id,
                        'name' => $layer->name
                    ];
                })->toArray()
            ];
        })->toArray()
    ]);
}

public function getSystemsByMissionID($missionId, User $user)
{
   
    // Chargez la mission avec les systèmes et leurs relations
    $mission = $this->missionRepository->getSystemsByMissionID($missionId)
    ->load(['systems.layers', 'systems.owner']);

    if (!$mission) {
        return null; // ou lancer une exception
    }
    

    $participation = $mission->participations->firstWhere('user_id', $user->id);
    $profileName = $participation?->profile?->profile_name ?? null;

    return response()->json([
        'systems' => $mission->systems->map(function ($system) use  ($mission, $user, $profileName) {
            return [
                'missionId' => $mission->id,
                'missionName' => $mission->mission_name,
                'id' => $system->id,
                'name' => $system->name,
                'description' => $system->description,
                'ownerId' => $system->owner->id ?? null,
                'ownerName' => $system->owner->full_name ?? null,
                'ownerContact' => $system->owner->email ?? null,
                'role' => ($user->role == 1) ? 'admin' : 'user',
                'profile' => $profileName,
                'layers' => $system->layers->map(function ($layer) {
                    return [
                        'id' => $layer->id,
                        'name' => $layer->name
                    ];
                })->toArray()
            ];
        })->toArray()
    ]);
}
public function getMissionSystemsById($id){
    $data=$this->missionRepository->getMissionSystemsById($id);
    return $data;	
}

    public function createMission(array $data): Mission
    {
        $status=$this->statusRepository->getMissionStatusByName(Status::STATUS_NON_COMMENCEE);
       
        if (!$status) {
            throw new \Exception("Statut 'non_commencee' pour les missions introuvable.");
        }
    
        $data['status_id'] =$status->id ; //NON commencée
        return $this->missionRepository->createMission($data);
    }

    public function closeMission(int $id):Mission
    {

        $status=$this->statusRepository->getMissionStatusByName('clôturée');
       
        if (!$status) {
            throw new \Exception("Statut 'clôturé' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //clôturé
        logger()->info('Status ID récupéré pour clôturé : ' . $status_id);
        return $this->missionRepository->closeMission($id,$status_id);
    }
    public function archiveMission(int $id):Mission
    {
        $status=$this->statusRepository->getMissionStatusByName('archivée');
       
        if (!$status) {
            throw new \Exception("Statut 'archivée' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //archivé
        return $this->missionRepository->archiveMission($id,$status_id);
    }
    public function cancelMission(int $id):Mission
    {
        $status=$this->statusRepository->getMissionStatusByName(Status::STATUS_Annulée);
       
        if (!$status) {
            throw new \Exception("Statut 'annulée' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //annulée
        logger()->info('Status ID récupéré pour annulation : ' . $status_id);

        return $this->missionRepository->cancelMission($id,$status_id);
    }

    public function requestCancelMission(int $id):Mission
    {
        $status=$this->statusRepository->getMissionStatusByName('en_attente_annulation');
       
        if (!$status) {
            throw new \Exception("Statut 'en_attente_annulation' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //en_attente_annulation
        return $this->missionRepository->requestCancelMission($id,$status_id);
    }
    public function requestCloseMission(int $id):Mission
    {
        $status=$this->statusRepository->getMissionStatusByName('en_attente_de_clôture');
       
        if (!$status) {
            throw new \Exception("Statut 'en_attente_de_clôture' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //en_attente_de_clôture
        return $this->missionRepository->requestCloseMission($id ,$status_id);
    }
    public function requestArchiveMission(int $id):Mission
    {
        $status=$this->statusRepository->getMissionStatusByName('en_attente_archivage');
       
        if (!$status) {
            throw new \Exception("Statut 'en_attente_archivage' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //en_attente_archivage
        return $this->missionRepository->requestArchiveMission($id,$status_id);
    }
   
    public function acceptrequestStatus(int $id): Mission
    {
        $mission = $this->missionRepository->findMissionById($id);
        $statusName = $this->statusRepository->getMissionStatusById($mission->status_id);
        
        $status = null;
    
        if ($statusName->status_name === 'en_attente_archivage') {
            $status = $this->statusRepository->getMissionStatusByName('archivée');
            $mission->previous_status_id = null;
        } elseif ($statusName->status_name  === 'en_attente_annulation') {
            $status = $this->statusRepository->getMissionStatusByName(Status::STATUS_Annulée);
            $mission->previous_status_id = null;
        } elseif ($statusName->status_name  === 'en_attente_de_clôture') {
            $status = $this->statusRepository->getMissionStatusByName('clôturée');
            $mission->previous_status_id = null;
        } else {
            throw new \Exception("Le statut actuel '{$statusName}' ne correspond à aucun traitement prévu.");
        }
    
        if (!$status) {
            throw new \Exception("Le nouveau statut pour la mission est introuvable.");
        }
    
        $status_id = $status->id;
    
        return $this->missionRepository->acceptrequestStatus($id, $status_id);
    }
    
    public function refuseRequestStatus(int $id):Mission
    {
        return $this->missionRepository->refuseRequestStatus($id);
    }

    public function stopMission(int $id): Mission
    {
        $status=$this->statusRepository->getMissionStatusByName('en_attente');
       
        if (!$status) {
            throw new \Exception("Statut 'en_attente' pour les missions introuvable.");
        }
    
        $status_id =$status->id ; //en_attente
        return $this->missionRepository->stopMission($id,$status_id);
    }
    
    public function resumeMission(int $id): ?Mission
{
    $mission = $this->missionRepository->findMissionById($id);
     $statusName = $this->statusRepository->getMissionStatusById($mission->status_id);

     if ($statusName->status_name !=='en_attente') {
        throw new \Exception("La mission n'est pas en pause.");
    }
    
    return $this->missionRepository->resumeMission($id);
}

    public function getArchivedMissions()
{
    return $this->missionRepository->getArchivedMissions();
}
public function getRequestStatusForMissions()
{
    return $this->missionRepository->getRequestStatusForMissions();
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
        // if ($this->missionRepository->hasRelatedData($mission)) {
        //     throw new \Exception("impossible de supprimer cette mission,des données lui sont encore associées.");
        // }

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
            $missionData['status_id'] = 10; // Définir le statut par défaut NON commencée
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
        $user = $userParticipation->user;
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

            'userId' => $user->id,
            'userFullName' => $user->first_name . ' ' . $user->last_name,
            'userRole' => $user->role == 1 ? 'admin' : 'user',
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
