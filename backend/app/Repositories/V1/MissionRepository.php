<?php

namespace App\Repositories\V1;

use App\Models\Mission;
use DB;

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



public function getMissionsInprogress()
{
    $results = DB::select('
        SELECT 
            m.id,
            m.mission_name AS mission,
            m.start_date,
            m.end_date,
            c.commercial_name AS client,

            COUNT(e.id) AS total_executions,
            COUNT(*) FILTER (WHERE e.launched_at IS NOT NULL) AS launched_executions,
            COUNT(*) FILTER (WHERE e.launched_at IS NULL) AS not_launched_executions,

            COUNT(*) FILTER (
                WHERE e.is_to_review = true AND e.is_to_validate = true  AND e.launched_at IS NOT NULL 
            ) AS finalized_executions,

            COUNT(*) FILTER (
                WHERE e.is_to_review = false OR e.is_to_validate = false AND e.launched_at IS NOT NULL AND stt.status_name IS  NULL 
            ) AS not_finalized_executions,


            COUNT(*) FILTER (
                WHERE stt.status_name = \'applied\'
            ) AS effective_controls,

            COUNT(*) FILTER (
                WHERE stt.status_name IS  DISTINCT FROM \'applied\'  AND NOT NULL

            COUNT(*) FILTER (WHERE stt.status_name = \'not applied\') AS not_applied_controls,
            COUNT(*) FILTER (WHERE stt.status_name = \'partially applied\') AS partially_applied_controls,
            COUNT(*) FILTER (WHERE stt.status_name = \'not tested\') AS not_tested_controls,
            COUNT(*) FILTER (WHERE stt.status_name = \'not applicable\') AS not_applicable_controls

        FROM public.missions m 
        JOIN public.clients c ON c.id = m.client_id
        JOIN public.statuses st ON m.status_id = st.id
        JOIN public.systems s ON s.mission_id = m.id
        LEFT JOIN public.layers l ON s.id = l.system_id
        JOIN public.executions e ON e.layer_id = l.id
        LEFT JOIN public.statuses stt ON stt.id = e.status_id

        WHERE st.status_name = \'en_cours\'

        GROUP BY m.id, m.mission_name, m.start_date, m.end_date, c.commercial_name

        ORDER BY m.id
    ');

    return $results;
}
public function getManagerMissionReport($missionId)
{
    return DB::select('
       WITH execution_stats AS (
    SELECT 
        ex.id AS execution_id,
        COUNT(r.id) AS total_remediations,
        COUNT(CASE WHEN st.status_name = \'terminé\' THEN 1 END) AS finished_remediations,
        COUNT(CASE WHEN st.status_name = \'en cours\' THEN 1 END) AS ongoing_remediations
    FROM executions ex
    JOIN layers l ON ex.layer_id = l.id
    JOIN systems s ON l.system_id = s.id
     JOIN remediations r ON r.execution_id = ex.id
     JOIN statuses st ON r.status_id = st.id
    WHERE s.mission_id = ?
    GROUP BY ex.id
)

SELECT 
    m.id AS mission_id,
    m.mission_name AS mission,
    m.start_date,
    m.end_date,
    c.commercial_name AS client,

    -- Contrôles
    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     WHERE s.mission_id = m.id) AS nbr_control,

(SELECT COUNT(DISTINCT ex.id) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
	 JOIN remediations re ON ex.id=re.execution_id
     WHERE s.mission_id = m.id) AS nbr_control_with_actions,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     WHERE s.mission_id = m.id AND ex.launched_at IS NOT NULL) AS control_commence,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     WHERE s.mission_id = m.id AND ex.launched_at IS NULL) AS control_non_commence,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     WHERE s.mission_id = m.id AND ex.launched_at IS NOT NULL 
           AND ex.is_to_review = true AND ex.is_to_validate = true) AS controls_finalises,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     WHERE s.mission_id = m.id  
           AND (ex.is_to_review = false OR ex.is_to_validate = false)) AS controls_non_finalises,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     JOIN statuses st ON ex.status_id = st.id
     WHERE s.mission_id = m.id AND ex.launched_at IS NOT NULL AND st.status_name = \'applied\') AS controls_effectifs,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     JOIN statuses st ON ex.status_id = st.id
     WHERE s.mission_id = m.id AND st.status_name != \'applied\') AS controls_ineffectifs,

-- Exécutions par statut
(SELECT COUNT(*) FROM executions ex
 JOIN layers l ON ex.layer_id = l.id
 JOIN systems s ON l.system_id = s.id
 JOIN statuses st ON ex.status_id = st.id
 WHERE s.mission_id = m.id AND st.status_name = \'not applied\') AS executions_not_applied,

(SELECT COUNT(*) FROM executions ex
 JOIN layers l ON ex.layer_id = l.id
 JOIN systems s ON l.system_id = s.id
 JOIN statuses st ON ex.status_id = st.id
 WHERE s.mission_id = m.id AND st.status_name = \'partially applied\') AS executions_partially_applied,

(SELECT COUNT(*) FROM executions ex
 JOIN layers l ON ex.layer_id = l.id
 JOIN systems s ON l.system_id = s.id
 JOIN statuses st ON ex.status_id = st.id
 WHERE s.mission_id = m.id AND st.status_name = \'not tested\') AS executions_not_tested,

(SELECT COUNT(*) FROM executions ex
 JOIN layers l ON ex.layer_id = l.id
 JOIN systems s ON l.system_id = s.id
 JOIN statuses st ON ex.status_id = st.id
 WHERE s.mission_id = m.id AND st.status_name = \'not applicable\') AS executions_not_applicable,

    -- Remédiations globales
    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     JOIN remediations r ON r.execution_id = ex.id
     WHERE s.mission_id = m.id) AS total_remediations,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     JOIN remediations r ON r.execution_id = ex.id
     JOIN statuses st ON r.status_id = st.id
     WHERE s.mission_id = m.id AND st.status_name = \'en cours\') AS total_ongoing_remediations,

    (SELECT COUNT(*) FROM executions ex
     JOIN layers l ON ex.layer_id = l.id
     JOIN systems s ON l.system_id = s.id
     JOIN remediations r ON r.execution_id = ex.id
     JOIN statuses st ON r.status_id = st.id
     WHERE s.mission_id = m.id AND st.status_name = \'terminé\') AS total_finished_remediations,

    -- Répartition par exécution en JSON
    json_agg(json_build_object(
        \'execution_id\', es.execution_id,
        \'total_remediations\', es.total_remediations,
        \'finished_remediations\', es.finished_remediations,
        \'ongoing_remediations\', es.ongoing_remediations
    )) AS repartition_par_execution

FROM missions m
JOIN clients c ON m.client_id = c.id
LEFT JOIN execution_stats es ON TRUE
WHERE m.id = ?
GROUP BY m.id, m.mission_name, m.start_date, m.end_date, c.commercial_name;

    ', [$missionId]);
}





}
