<?php

namespace App\Repositories\V1;

use App\Models\Mission;

class MissionRepository
{
    public function getAllMissions()
    {
        return Mission::all();
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
}
