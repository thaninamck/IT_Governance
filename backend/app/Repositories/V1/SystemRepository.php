<?php

namespace App\Repositories\V1;

use App\Models\Execution;
use App\Models\System;
use DB;

class SystemRepository
{
    public function getAllSystems()
    {
        return System::with(['owner','mission'])->get();
    }

    public function createSystem(array $data): System
    {
        return System::create($data);
    }

    public function updateSystem($id, array $data): ?System
    {
        $system = System::find($id);

        if (!$system) {
            return null;
        }

        $system->update($data);

        return $system;
    }

    public function findSystemById(int $id)
    {
        return System::find($id);
    }

    public function deleteSystem(int $id): ?string
    {
        $system=System::find($id);

        if (!$system) {
            return null;
        }
        // Supprimer d'abord les associations dans mission_systems
   // $system->missions()->detach();

        $system_name=$system->name;
        $system->delete();

        return $system_name;
    }
    public function getsystemInfo($systemId)
    {
        $system = System::with(['owner','layers'])->find($systemId);
        return $system;
    }
    public function getsystemById($userId, $systemId)
{
    return System::with([
        'owner',
        'layers',
        'mission',
        'mission.participations' => function ($query) use ($userId) {
            $query->where('user_id', $userId)->with('profile');
        },
        'mission.participations.user'
    ])->find($systemId);
}


    public function getSystemExecutionsWithTheirStatusesByMission($missionId, $layerName = 'Applicative')
{
    return DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->join('statuses as st', 'e.status_id', '=', 'st.id')
        ->where('s.mission_id', $missionId)
        ->where('l.name', $layerName)  // Filtre par nom de couche
        ->select([
            's.name as application',
            'l.name as couche',
            'e.cntrl_modification as control',
            'st.status_name as status'
        ])
        ->get();
}

public function getDBLayerExecutionsWithTheirStatusesByMission($missionId)
{
    $targetLayers = [
        'Bases de données',
        'Procédurale',
        'Sécurité physique & environnementale'
    ];

    return DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->join('statuses as st', 'e.status_id', '=', 'st.id')
        ->where('s.mission_id', $missionId)
        ->whereIn('l.name', $targetLayers)  // Filtre MULTIPLES couches
        ->select([
            's.name as application',
            'l.name as couche',
            'e.cntrl_modification as control',
            'st.status_name as status'
        ])
        ->get();
}



public function getOSLayerExecutionsWithTheirStatusesByMission($missionId)
{
    $targetLayers = [
        'Bases de données',
        'Procédurale',
        'Système d\'exploitation',
        'Sécurité physique & environnementale'
    ];

    return DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->join('statuses as st', 'e.status_id', '=', 'st.id')
        ->where('s.mission_id', $missionId)
        ->whereIn('l.name', $targetLayers)  // Filtre MULTIPLES couches
        ->select([
            's.name as application',
            'l.name as couche',
            'e.cntrl_modification as control',
            'st.status_name as status'
        ])
        ->get();
}

public function getPhysicalExecutionsWithTheirStatusesByMission($missionId, $layerName = 'Sécurité physique & environnementale')
{
    return DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->join('statuses as st', 'e.status_id', '=', 'st.id')
        ->where('s.mission_id', $missionId)
        ->where('l.name', $layerName)  // Filtre par nom de couche
        ->select([
            's.name as application',
            'l.name as couche',
            'e.cntrl_modification as control',
            'st.status_name as status'
        ])
        ->get();
}

public function getProceduralExecutionsWithTheirStatusesByMission($missionId, $layerName = 'Procédurale')
{
    return DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->join('statuses as st', 'e.status_id', '=', 'st.id')
        ->where('s.mission_id', $missionId)
        ->where('l.name', $layerName)  // Filtre par nom de couche
        ->select([
            's.name as application',
            'l.name as couche',
            'e.cntrl_modification as control',
            'st.status_name as status'
        ])
        ->get();
}


public function getMissionGeneralInfos($missionId)
{
    //  Avancement global : total, positionnés, et pourcentage
    $globalStats = DB::table('executions as e')
        ->join('layers as l', 'e.layer_id', '=', 'l.id')
        ->join('systems as s', 'l.system_id', '=', 's.id')
        ->where('s.mission_id', $missionId)
        ->selectRaw('
            COUNT(e.id) as total_executions,
            COUNT(e.status_id) as positioned_executions,
            ROUND(COUNT(e.status_id) * 100.0 / NULLIF(COUNT(e.id), 0), 1) as global_advancement
        ')
        ->first();

    //  Avancement par application
    $apps_and_their_advancement = DB::table('systems as s')
        ->join('layers as l', 's.id', '=', 'l.system_id')
        ->join('executions as e', 'e.layer_id', '=', 'l.id')
        ->where('s.mission_id', $missionId)
        ->select(
            's.name as name',
            's.id as application_id',
            DB::raw('COUNT(e.id) as total_executions'),
            DB::raw('COUNT(e.status_id) as positioned_executions'),
            DB::raw('ROUND(COUNT(e.status_id) * 100.0 / NULLIF(COUNT(e.id), 0), 1) as progress')
        )
        ->groupBy('s.name', 's.id')
        ->orderBy('s.name')
        ->get();

    return [
        'apps' => $apps_and_their_advancement,
        'positionned_executions' => $globalStats->positioned_executions,
        'total_executions' => $globalStats->total_executions,
        'global_advancement' => $globalStats->global_advancement,
    ];
}


public function getExecutionsGroupedByLayerStatusAndOwner($systemId)
{
    return DB::select("
        SELECT 
            o.full_name AS system_owner,
            m.mission_name,
            c.commercial_name AS client,
            l.name AS layer,
            e.control_owner,
            COALESCE(st.status_name, 'non positionné') AS status,
            COUNT(e.id) AS control_count
        FROM 
            executions e
        JOIN 
            layers l ON e.layer_id = l.id
        JOIN 
            systems s ON l.system_id = s.id
        JOIN 
            owners o ON s.owner_id = o.id
        JOIN 
            missions m ON s.mission_id = m.id
        JOIN 
            clients c ON m.client_id = c.id
        LEFT JOIN 
            statuses st ON e.status_id = st.id
        WHERE 
            s.id = ?
        GROUP BY 
            o.full_name, m.mission_name, c.commercial_name,
            l.name, e.control_owner, st.status_name
        ORDER BY 
            l.name, e.control_owner, status
    ", [$systemId]);
}



}
