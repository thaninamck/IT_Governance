<?php
namespace App\Services\V1;

use App\Models\Participation;
use App\Repositories\V1\ParticipationRepository;
use Illuminate\Support\Facades\Hash;

class ParticipationService
{

    protected ParticipationRepository $participationRepository;
    protected UserService $userService;
    public function __construct(ParticipationRepository $participationRepository,UserService $userService)
    {
        $this->userService = $userService;
        $this->participationRepository = $participationRepository;
    }

    public function createParticipation(array $data): Participation
    {
        return $this->participationRepository->createParticipation($data);
    }

    public function addMembersToMission(int $missionId, array $members): array
    {
        $addedMembers = [];
        
        foreach ($members as $member) {
            // Vérifie d'abord si la participation existe déjà
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
                 // Chargez les relations pour la réponse
        $participation->load(['user', 'profile']);

                $addedMembers[] = [
                    $participation,
                    'full_name' => $participation->user->first_name . ' ' . $participation->user->last_name,
                    'profile_name' => $participation->profile->profile_name,
                ];

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