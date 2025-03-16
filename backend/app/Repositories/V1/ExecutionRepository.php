<?php

namespace App\Repositories\V1;
use App\Models\Execution;
use App\Models\Status;
use Illuminate\Support\Facades\DB;

class ExecutionRepository
{

    public function createExecution(array $executionData){
        $statusId = Status::where('status_name', 'en attente')->value('id');

            return Execution::create([
                'control_id' => $executionData['controlId'],
                'cntrl_modification' => $executionData['controlDescription'],
                'control_owner' => $executionData['controlOwner'],
                'user_id' => $executionData['controlTester'],
                'mission_id' => $executionData['missionId'],
              'status_id' => $statusId,
            ]);
        
    }


public function getExecutionsByMission($missionId)
{
    return DB::select("
        SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
            e.remark AS execution_remark,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
            st.status_name,
            st.id AS status_id,
            m.id AS mission_id, 
            m.mission_name,
            c.id AS control_id, 
            c.description AS control_description,
            c.code AS control_code,
            cov.id AS coverage_id,
            cov.risk_id AS coverage_risk_id,
            cov.layer_id AS coverage_layer_id,
            r.id AS risk_id,
            r.name AS risk_name,
            r.code AS risk_code,
            r.description AS risk_description,
            l.id AS layer_id,
            l.name AS layer_name,
            s.id AS system_id,
            s.name AS system_name,
            u.id AS user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS user_full_name
        FROM public.executions e
        JOIN public.missions m ON m.id = e.mission_id
        JOIN public.controls c ON c.id = e.control_id
        JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
        JOIN public.risks r ON r.id = cov.risk_id
        JOIN public.layers l ON l.id = cov.layer_id
        JOIN public.systems s ON l.system_id = s.id
        JOIN public.users u ON e.user_id = u.id
        JOIN public.statuses st ON e.status_id = st.id
        WHERE m.id = ?", [$missionId]
    );
}

}
