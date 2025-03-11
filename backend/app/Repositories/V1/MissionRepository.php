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
     


    public function createMission(array $data):Mission
    {
        return Mission::create($data);
    }

    public function updateMission($id,array $data): ?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
        $mission->update($data);

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

    public function stopMission(int $id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = 10;
         $mission->save();

        return $mission;
    }



public function resumeMission(int $id, int $previousStatusId): ?Mission
{
    $mission = Mission::find($id);

    if (!$mission) {
        return null;
    }

    // Vérifier si la mission est en pause
    if ($mission->status_id !== 10) {
        throw new \Exception("La mission n'est pas en pause.");
    }

    // Restaurer le statut précédent
    $mission->status_id = $previousStatusId;
    $mission->save();

    return $mission;
}


}
