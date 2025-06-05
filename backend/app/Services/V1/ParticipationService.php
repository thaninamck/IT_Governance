<?php
namespace App\Services\V1;

use App\Models\Participation;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\ParticipationRepository;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Hash;

class ParticipationService
{

    protected ParticipationRepository $participationRepository;
    protected MissionRepository $missionRepository;
    protected NotificationService $notificationService;
    protected UserService $userService;
    public function __construct(ParticipationRepository $participationRepository,UserService $userService,NotificationService $notificationService,MissionRepository $missionRepository )
    {
        $this->userService = $userService;
        $this->participationRepository = $participationRepository;
        $this->notificationService =$notificationService;
        $this->missionRepository =$missionRepository;
    }

    public function createParticipation(array $data): Participation
    {
        return $this->participationRepository->createParticipation($data);
    }

//     public function addMembersToMission(int $missionId, array $members): array
//     {
//         $addedMembers = [];
        
//         foreach ($members as $member) {
//             // Vérifie d'abord si la participation existe déjà
//             $existing = $this->participationRepository->findParticipationByMissionAndUserAndProfile(
//                 $missionId, 
//                 $member['user_id'], 
//                 $member['profile_id']
//             );
            
//             if (!$existing) {
//                 $participation = $this->participationRepository->createParticipation([
//                     'mission_id' => $missionId,
//                     'user_id' => $member['user_id'],
//                     'profile_id' => $member['profile_id']
    
//                 ]);
                
//                 $this->notificationService->sendNotification(
//                     $member['user_id'],
//                     "Vous avez été ajouté à la mission en tant que " . $participation->profile->profile_name,
//                     ['type' => 'aff_mission', 'id' => $missionId],
//                     "aff_mission"
//                 );
//  // Récupère les relations pour les infos complètes
//  $participation->load(['user', 'profile']);
//  // Ajoute à la liste des membres ajoutés
//                 $addedMembers[] = [
//                     $participation,
//                     'full_name' => $participation->user->first_name . ' ' . $participation->user->last_name,
//                     'profile_name' => $participation->profile->profile_name,
//                 ];

                  

//             }
//         }
        
//         return $addedMembers;
//     }
    
public function addMembersToMission(int $missionId, array $members): array
{
    $addedMembers = [];
$missionName =$this->missionRepository->findMissionById($missionId);
 
    foreach ($members as $member) {
        // Vérifie si la participation existe déjà
        $existing = $this->participationRepository->findParticipationByMissionAndUserAndProfile(
            $missionId,
            $member['user_id'],
            $member['profile_id']
        );

        if (!$existing) {
            $participation = $this->participationRepository->createParticipation([
                'mission_id' => $missionId,
                'user_id' => $member['user_id'],
                'profile_id' => $member['profile_id']
            ]);

            // Charge les relations
            $participation->load(['user', 'profile']);

            // Envoie la notification
            $this->notificationService->sendNotification(
                $member['user_id'],
                "Vous avez été ajouté à la mission $missionName->mission_name en tant que " . $participation->profile->profile_name,
                ['type' => 'aff_mission', 'id' => $missionId],
                "aff_mission"
            );

            // Ajoute à la liste
            $addedMembers[] = [
                'participation' => $participation,
                'full_name' => $participation->user->first_name . ' ' . $participation->user->last_name,
                'profile_name' => $participation->profile->profile_name,
            ];

            // Essaye d’envoyer l’e-mail et loggue les erreurs s’il y en a
            try {
                \Mail::raw(
                    "Bonjour " . $participation->user->first_name . " " . $participation->user->last_name .
                    ",\n\nVous avez été ajouté à la mission (ID: $missionId) en tant que " .
                    $participation->profile->profile_name . ".\n\nMerci.",
                    function ($message) use ($participation) {
                        $message->to($participation->user->email)
                            ->subject("Nouvelle affectation à une mission");
                    }
                );
                \Log::info("E-mail envoyé à " . $participation->user->email);
            } catch (\Exception $e) {
                \Log::error("Erreur lors de l’envoi de l’e-mail à " . $participation->user->email . " : " . $e->getMessage());
            }
        }
    }

    return $addedMembers;
}

   
    // Mettre à jour un participant
    public function updateParticipation(int $id, array $data): Participation
    {
        return $this->participationRepository->updateParticipation($id, $data);
    }
    public function getmanagerMission($missionID){
        return  $this->participationRepository->getmanagerMission($missionID);
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

   
public function deleteParticipationById(int $id): ?string
{

   $participation=$this->participationRepository->findMemberById($id);

   if(!$participation){
    return null;
   }
   return $this->participationRepository->deleteParticipation($id);
}

    public function getTestersByMissionID($id)
{
    $testers_ids = $this->participationRepository->getTestersByMissionID($id);

    if ($testers_ids->isEmpty()) {
        return null;
    }

    $users = $this->userService->getUsersByIds($testers_ids);

    $testers = $users->map(function($user) {
        return [
            'id' => $user->id,
            'designation' => $user->first_name . ' ' . $user->last_name,
        ];
    });

    return $testers;
}


}