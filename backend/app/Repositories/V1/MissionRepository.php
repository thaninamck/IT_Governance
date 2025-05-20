<?php

namespace App\Repositories\V1;

use App\Models\Mission;

class MissionRepository
{
    //  public function getMissionSystemsById($id)
    //  {
    //      return Mission::with(['systems.layers.owner'])->where('id',$id) ->get();
    //  }

    public function getMissionSystemsById($id)
     {
         return Mission::with(['systems.layers', 'systems.owner', 'participations.profile'])
         ->find($id);
     
     }

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
        return 
      //  $mission->executions()->exists()||
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

    public function closeMission(int $id , int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //CLOSE
         $mission->save();

        return $mission;
    }

    public function archiveMission(int $id , int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; // archivé
         $mission->save();

        return $mission;
    }

    public function getArchivedMissions()
    {
        return Mission::where('status_name','archivée')->get();
    }

    public function cancelMission(int $id,int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //annulé
         logger()->info('Status ID  : ' . $mission->status_id);
         $mission->save();

        return $mission;
    }

    public function requestCancelMission(int $id , int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        // Stocker l'état précédent
    $mission->previous_status_id = $mission->status_id;
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //en attente annulation
         $mission->save();

        return $mission;
    }
    public function requestCloseMission(int $id, int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        // Stocker l'état précédent
    $mission->previous_status_id = $mission->status_id;
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //en attente annulation
         $mission->save();

        return $mission;
    }

    public function requestArchiveMission(int $id,int $status_id):?Mission
    {
        $mission=Mission::find($id);

        if(!$mission){
            return null;
        }
        // Stocker l'état précédent
    $mission->previous_status_id = $mission->status_id;
        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //en attente annulation
         $mission->save();

        return $mission;
    }
    public function refuseRequestStatus(int $id): ?Mission
    {
        $mission = Mission::find($id);
    
        if (!$mission) {
            return null;
        }
    
        $mission->status_id = $mission->previous_status_id;
        $mission->previous_status_id = null;
        $mission->save();
    
            return $mission;
    
       
    }  
    public function acceptrequestStatus(int $id,int $status_id): ?Mission
    {
        $mission = Mission::find($id);
        
        if(!$mission) {
            return null;
        }
        
    //    if($mission->status_id == 14){
    //     $mission->status_id = 10;
    //     $mission->previous_status_id = null; 
    //    } elseif($mission->status_id == 15){
    //     $mission->status_id = 11;
    //     $mission->previous_status_id = null; 
    //    }elseif($mission->status_id == 16){
    //     $mission->status_id = 13;
    //     $mission->previous_status_id = null; 
    //    }
    $mission->status_id = $status_id;
        $mission->save();
        
        
        return $mission;
    }
    public function getRequestStatusForMissions()
    {
        return Mission::whereIn('status_name', ['en_attente_archivage', 'en_attente_annulation', 'en_attente_de_clôture'])->get();
    }

    public function stopMission(int $id ,int $status_id):?Mission
    {
        $mission=Mission::find($id);
    
        if(!$mission){
            return null;
        }
        // Stocker l'état précédent
    $mission->previous_status_id = $mission->status_id;

        
         // Mettre à jour le statut de la mission
         $mission->status_id = $status_id; //stope
         $mission->save();
    
        return $mission;
    }
    
    public function resumeMission(int $id): ?Mission
    {
        $mission = Mission::find($id);
    
        if (!$mission) {
            return null;
        }
    
        // Vérifier si la mission est en pause
        // if ($mission->status_id !== 12) {
        //     throw new \Exception("La mission n'est pas en pause.");
        // }
    
        $now = \Carbon\Carbon::now();
        $endDate = \Carbon\Carbon::parse($mission->end_date);
    
        // Vérifier si la date actuelle est supérieure à la date de fin
        if ($now->gt($endDate->endOfDay())) {
            throw new \Exception("La mission ne peut pas être reprise car la date actuelle dépasse la date de fin.");
        }
    
        // Restaurer le statut précédent
        $mission->status_id = $mission->previous_status_id;
        $mission->previous_status_id = null;
    
        // Mettre la date de début à aujourd’hui
        $mission->start_date = $now->toDateString();
    
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
        return 7; // Statut "non commencée"
    } elseif ($currentDate->between($start, $end)) {
        return 8; // Statut "en cours"
    } else {
        return 9; // Statut "en retard"
    }
}

public function getSystemsByMissionID(int $missionId )
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
