<?php

namespace App\Repositories\V1;

use App\Models\Mission;

class MissionRepository
{
    // public function getAllMissions()
    // {
    //     return Mission::with(['client', 'status', 'participations' => function ($query) {
    //         $query->where('profile_id', 3);
    //     }])->get();
    // }

    public function getAllMissions()
    {
        return Mission::with(['client', 'status', 'participations.user'])->get();
    }
     


    public function getMembersByMission($missionId)
{
    $mission = Mission::with(['participations.user', 'participations.profile'])->find($missionId);

   
    

    return $mission;
}


    public function createMission(array $data):Mission
    {
        return Mission::create($data);
    }

    public function updateMission($id,array $data): ?Mission
    {
         // Récupérer la mission avec les relations
         $mission = Mission::with(['client', 'status', 'participations.user'])->find($id);

         if (!$mission) {
             return null;
         }
 
         // Mettre à jour les champs de la mission
         $mission->update($data);
 
         // Si vous avez besoin de mettre à jour des relations, vous pouvez le faire ici
         // Par exemple, si vous avez des données pour 'client' ou 'status' dans $data
         if (isset($data['client'])) {
             $mission->client()->update($data['client']);
         }
 
         if (isset($data['status'])) {
             $mission->status()->update($data['status']);
         }
 
         // Recharger la mission avec les relations mises à jour pour retourner l'objet complet
         $mission->load(['client', 'status', 'participations.user']);
 
         return $mission;
    }

    public function findMissionById(int $id)
    {
        return Mission::find($id);
    }

    public function hasRelatedData(Mission $mission): bool
    {
        return $mission->executions()->exists() ||
        $mission->remediations()->exists();

    }
    public function deleteMission(int $id): ?string
    {
        $mission=Mission::find($id);
        if(!$mission){
            return null;
        }
        $mission_name=$mission->mission_name;
        $mission->delete();

        return $mission_name;
    }

    public function createMultipleMissions(array $missionsData)
    {
        $createdMissions=[];

        foreach($missionsData as $missionData){
            $createdMissions[]=Mission::create($missionData);
        }
        return collect($createdMissions);
    }

    public function closeMission(int $id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = 8;
         $mission->save();

        return $mission;
    }

    public function archiveMission(int $id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = 1;
         $mission->save();

        return $mission;
    }

    public function getArchivedMissions()
    {
        return Mission::where('status_id',1)->get();
    }

    public function cancelMission(int $id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = 6;
         $mission->save();

        return $mission;
    }

    // public function stopMission(int $id):?Mission
    // {
    //     $mission=Mission::find($id);

    //     if(!$mission){
    //         return null;
    //     }
        
    //     // Stocker le statut précédent dans un champ dédié 
    // $mission->previous_status_id = $mission->status_id;
    //      // Mettre à jour le statut de la mission
    //      $mission->status_id = 10;
    //      $mission->save();

    //     return $mission;
    // }

    public function stopMission(int $id): array
{
    $mission = Mission::find($id);

    if (!$mission) {
        return ['mission' => null, 'previous_status_id' => null];
    }

    // Stocker le statut précédent
    $previousStatusId = $mission->status_id;

    // Mettre à jour le statut de la mission pour la mettre en pause
    $mission->status_id = 10; // Statut "temporaire"
    $mission->save();

    return [
        'mission' => $mission,
        'previous_status_id' => $previousStatusId,
    ];
}



// public function resumeMission(int $id, int $previousStatusId): ?Mission
// {
//     $mission = Mission::find($id);

//     if (!$mission) {
//         return null;
//     }

//     // Vérifier si la mission est en pause
//     if ($mission->status_id !== 10) {
//         throw new \Exception("La mission n'est pas en pause.");
//     }

//     // Restaurer le statut précédent
//     $mission->status_id = $previousStatusId;
//     $mission->save();

//     return $mission;
// }

public function resumeMission(int $id, int $previousStatusId, string $newStartDate): ?Mission
{
    $mission = Mission::find($id);

    if (!$mission) {
        return null;
    }

    // Vérifier si la mission est en pause
    if ($mission->status_id !== 10) {
        throw new \Exception("La mission n'est pas en pause.");
    }

    // Convertir les dates en objets Carbon pour faciliter la comparaison
    $newStartDate = \Carbon\Carbon::parse($newStartDate);
    $missionEndDate = \Carbon\Carbon::parse($mission->end_date);

    // Vérifier si la nouvelle date de début est supérieure à la date de fin
    if ($newStartDate->gt($missionEndDate)) {
        throw new \Exception("La mission ne peut pas être reprise car la date de début serait supérieure à la date de fin.");
    }

    // Restaurer le statut précédent
    $mission->status_id = $previousStatusId;

    // Mettre à jour la date de début
    $mission->start_date = $newStartDate->toDateString();

    // Sauvegarder les modifications
    $mission->save();

    return $mission;
}
public function updateMissionStatuses()
{
    $missions = Mission::all();

    foreach ($missions as $mission) {
        $newStatus = $this->getAutomaticStatus($mission->start_date, $mission->end_date);
        if ($mission->status_id !== $newStatus) {
            $mission->status_id = $newStatus;
            $mission->save();
        }
    }
}

private function getAutomaticStatus($startDate, $endDate)
{
    $currentDate = now();
    $start = \Carbon\Carbon::parse($startDate);
    $end = \Carbon\Carbon::parse($endDate);

    if ($currentDate->lt($start)) {
        return 16; // Statut "non commencée"
    } elseif ($currentDate->between($start, $end)) {
        return 9; // Statut "en cours"
    } else {
        return 17; // Statut "en retard"
    }
}


public function getSystemsByMissionID(int $missionId)
{
    // Trouver la mission avec ses systèmes
    $mission = Mission::with('systems.owner')->find($missionId);

    return $mission;
}
public function attachSystem(int $missionId, int $systemId): void
{
    $mission = Mission::findOrFail($missionId);
    $mission->systems()->attach($systemId);
}


public function getUserMissions($userId)
{
    // return Mission::with([
    //         'client:id,commercial_name',
    //         'status:id,status_name',
    //         'participations.user:id,first_name,last_name,email,role',
    //         'participations.profile:id,profile_name'
    //     ])
    //     ->whereHas('participations', function($query) use ($userId) {
    //         $query->where('user_id', $userId);
    //     })
    //     ->get();
        $missions = Mission::forUser($userId)->get();
        return $missions;
}
}
