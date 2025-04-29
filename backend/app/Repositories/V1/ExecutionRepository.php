<?php

namespace App\Repositories\V1;
use App\Models\Execution;
use App\Models\Status;
use App\Models\StepExecution;
use App\Models\StepTestScript;
use Illuminate\Support\Facades\DB;

class ExecutionRepository
{

    public function createExecution(array $executionData)
{
    // Création de l'exécution
    $execution = Execution::create([
        'cntrl_modification' => $executionData['controlDescription'],
        'control_owner' => $executionData['controlOwner'],
        'user_id' => $executionData['controlTester'],
        'layer_id' => $executionData['layerId'],
        'status_id' => null,
        'is_to_validate' => false,
        'is_to_review' => false,
    ]);

    // Récupération des steps liés à ce control
    $stepsIds = StepTestScript::where('control_id', $executionData['controlId'])->pluck('id');

    // Insertion dans la table pivot
    foreach ($stepsIds as $stepId) {
        StepExecution::create([
            'execution_id' => $execution->id,
            'step_id' => $stepId,
            'checked' => false, 
            'comment' => null,
        ]);
    }

    return $execution;
}

    
    public function getExecutionsByMission($missionId)
{
    return DB::select("
        SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
            e.comment AS execution_comment,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
            sts.control_id,

            json_agg( json_build_object(
              'step_execution_id', se.id,
              'step text' , sts.text,
              'step_comment', se.comment,
              'step_checked', se.checked
            )) AS steps,

            json_agg( json_build_object(
              'source_name', so.name
            )) AS sources,

            m.id AS mission_id, 
            mission_name,

            cov.id AS coverage_id,
            cov.risk_id AS coverage_risk_id,
            cov.risk_owner AS risk_owner,
            cov.risk_modification,

            r.id AS risk_id,
            r.name AS risk_name,
            r.code AS risk_code,
            r.description AS risk_description,

            l.id AS layer_id,
            l.name AS layer_name,
            st.id AS status_id,
            st.status_name,

            s.id AS system_id,
            s.name AS system_name,
            o.full_name AS system_owner_full_name,
            o.email AS system_owner_email,
            c.id AS control_id, 
            c.description AS control_description,
            c.code AS control_code,
            mp.description AS major_process,
            sp.name AS sub_process,
            t.name AS type_name,
            u.id AS user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS tester_full_name

        FROM public.missions m
        JOIN public.systems s ON s.mission_id = m.id
        JOIN public.layers l ON l.system_id = s.id
        JOIN public.executions e ON e.layer_id = l.id
        JOIN public.step_executions se ON e.id = se.execution_id
        JOIN public.step_test_scripts sts ON se.step_id = sts.id
        JOIN public.controls c ON c.id = sts.control_id
        JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
        JOIN public.risks r ON r.id = cov.risk_id
        LEFT JOIN public.statuses st ON e.status_id = st.id
        LEFT JOIN public.major_processes mp ON c.major_id = mp.id
        LEFT JOIN public.sub_processes sp ON c.sub_id = sp.id
        LEFT JOIN public.types t ON c.type_id = t.id
        JOIN public.cntrl_srcs cs ON cs.control_id = c.id
        JOIN public.sources so ON cs.source_id = so.id
        JOIN public.users u ON e.user_id = u.id
        JOIN public.owners o ON s.owner_id = o.id
        WHERE m.id = ?

        GROUP BY 
            e.id, e.cntrl_modification, e.comment, e.control_owner, e.launched_at, e.ipe, e.effectiveness, e.design,
            sts.control_id,
            st.id, st.status_name,
            t.name, sp.name, mp.description,
            m.id, mission_name,
            cov.id, cov.risk_id, cov.risk_owner, cov.risk_modification,
            r.id, r.name, r.code, r.description,
            l.id, l.name,
            s.id, s.name,
            o.full_name, o.email,
            c.id, c.description, c.code,
            u.id, u.first_name, u.last_name;
    ", [$missionId]);
}

public function getExecutionById($executionId)
{
    return DB::select("
      SELECT 
    e.id AS execution_id,
    sts.control_id,
    e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
e.ipe,
e.design,
e.effectiveness,
e.comment,
    json_agg(DISTINCT jsonb_build_object(
        'step_execution_id', se.id,
        'step_text', sts.text,
        'step_comment', se.comment,
        'step_checked', se.checked
    )) AS steps,

    json_agg(DISTINCT jsonb_build_object(
        'id', r.id,
        'text', r.text,
        'y', r.y,
        'initials', UPPER(LEFT(u.first_name, 1) || '' || LEFT(u.last_name, 1)),
        'user_id',u.id,
        'name', u.first_name || ' ' || u.last_name
    )) AS remarks,

    json_agg(DISTINCT jsonb_build_object(
        'evidence_id', ev.id,
        'file_name', ev.file_name,
        'stored_name', ev.stored_name,
        'is_f_test', ev.is_f_test
    )) AS evidences

FROM public.executions e
JOIN public.step_executions se ON e.id = se.execution_id
JOIN public.step_test_scripts sts ON se.step_id = sts.id
JOIN public.controls c ON c.id = sts.control_id
LEFT JOIN public.executions_evidences ev ON ev.execution_id = e.id
LEFT JOIN public.remarks r ON r.execution_id = e.id
LEFT JOIN public.users u ON r.user_id = u.id

WHERE e.id = ?

GROUP BY 
    e.id,
    sts.control_id;

    ", [$executionId]);
}


    public function getExecutionsByApp($appId)
    {
        return DB::select("
    SELECT 
        e.id AS execution_id, 
        e.cntrl_modification AS execution_modification,
        e.comment AS execution_comment,
        e.control_owner AS execution_control_owner,
        e.launched_at AS execution_launched_at,
        e.ipe AS execution_ipe,
        e.effectiveness AS execution_effectiveness,
        e.design AS execution_design,
        sts.control_id,

        json_agg( DISTINCT jsonb_build_object(
          'step_execution_id', se.id,
          'step text' , sts.text,
          'step_comment', se.comment,
          'step_checked', se.checked
        )) AS steps,

        json_agg( DISTINCT jsonb_build_object(
          'source_name', so.name
        )) AS sources,

        m.id AS mission_id, 
        m.mission_name,

        cov.id AS coverage_id,
        cov.risk_id AS coverage_risk_id,
        cov.risk_owner AS risk_owner,
        cov.risk_modification,

        r.id AS risk_id,
        r.name AS risk_name,
        r.code AS risk_code,
        r.description AS risk_description,

        l.id AS layer_id,
        l.name AS layer_name,
        st.id AS status_id,
        st.status_name,

        s.id AS system_id,
        s.name AS system_name,
        o.full_name AS system_owner_full_name,
        o.email AS system_owner_email,
        c.id AS control_id, 
        c.description AS control_description,
        c.code AS control_code,
        mp.description AS major_process,
        sp.name AS sub_process,
        t.name AS type_name,
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS tester_full_name

    FROM public.missions m
    JOIN public.systems s ON s.mission_id = m.id
    JOIN public.layers l ON l.system_id = s.id
    JOIN public.executions e ON e.layer_id = l.id
    JOIN public.step_executions se ON e.id = se.execution_id
    JOIN public.step_test_scripts sts ON se.step_id = sts.id
    JOIN public.controls c ON c.id = sts.control_id
    JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
    JOIN public.risks r ON r.id = cov.risk_id
    LEFT JOIN public.statuses st ON e.status_id = st.id
    LEFT JOIN public.major_processes mp ON c.major_id = mp.id
    LEFT JOIN public.sub_processes sp ON c.sub_id = sp.id
    LEFT JOIN public.types t ON c.type_id = t.id
    JOIN public.cntrl_srcs cs ON cs.control_id = c.id
    JOIN public.sources so ON cs.source_id = so.id
    JOIN public.users u ON e.user_id = u.id
    JOIN public.owners o ON s.owner_id = o.id
    WHERE s.id = ?
    GROUP BY 
        e.id, e.cntrl_modification, e.comment, e.control_owner, e.launched_at,
        e.ipe, e.effectiveness, e.design, sts.control_id,
        m.id, m.mission_name,
        cov.id, cov.risk_id, cov.risk_owner, cov.risk_modification,
        r.id, r.name, r.code, r.description,
        l.id, l.name,
        st.id, st.status_name,
        s.id, s.name,
        o.full_name, o.email,
        c.id, c.description, c.code,
        mp.description, sp.name, t.name,
        u.id, u.first_name, u.last_name
", [$appId]);

    }




    public function getExecutionsByMissionAndTester($missionId,$userId)
    {
        return DB::select("
         SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
            e.comment AS execution_remark,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
            sts.control_id,

            json_agg( json_build_object(
              'step_execution_id', se.id,
              'step text' , sts.text,
              'step_comment', se.comment,
              'step_checked', se.checked
            )) AS steps,

            json_agg( json_build_object(
              'source_name', so.name
            )) AS sources,

            m.id AS mission_id, 
            mission_name,

            cov.id AS coverage_id,
            cov.risk_id AS coverage_risk_id,
            cov.risk_owner AS risk_owner,
            cov.risk_modification,

            r.id AS risk_id,
            r.name AS risk_name,
            r.code AS risk_code,
            r.description AS risk_description,

            l.id AS layer_id,
            l.name AS layer_name,
            st.id AS status_id,
            st.status_name,

            s.id AS system_id,
            s.name AS system_name,
            o.full_name AS system_owner_full_name,
            o.email AS system_owner_email,
            c.id AS control_id, 
            c.description AS control_description,
            c.code AS control_code,
            mp.description AS major_process,
            sp.name AS sub_process,
            t.name AS type_name,
            u.id AS user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS tester_full_name

        FROM public.missions m
        JOIN public.systems s ON s.mission_id = m.id
        JOIN public.layers l ON l.system_id = s.id
        JOIN public.executions e ON e.layer_id = l.id
        JOIN public.step_executions se ON e.id = se.execution_id
        JOIN public.step_test_scripts sts ON se.step_id = sts.id
        JOIN public.controls c ON c.id = sts.control_id
        JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
        JOIN public.risks r ON r.id = cov.risk_id
        LEFT JOIN public.statuses st ON e.status_id = st.id
        LEFT JOIN public.major_processes mp ON c.major_id = mp.id
        LEFT JOIN public.sub_processes sp ON c.sub_id = sp.id
        LEFT JOIN public.types t ON c.type_id = t.id
        JOIN public.cntrl_srcs cs ON cs.control_id = c.id
        JOIN public.sources so ON cs.source_id = so.id
        JOIN public.users u ON e.user_id = u.id
        JOIN public.owners o ON s.owner_id = o.id
        WHERE m.id = ? and u.id=?

        GROUP BY 
            e.id, e.cntrl_modification, e.comment, e.control_owner, e.launched_at, e.ipe, e.effectiveness, e.design,
            sts.control_id,
            st.id, st.status_name,
            t.name, sp.name, mp.description,
            m.id, mission_name,
            cov.id, cov.risk_id, cov.risk_owner, cov.risk_modification,
            r.id, r.name, r.code, r.description,
            l.id, l.name,
            s.id, s.name,
            o.full_name, o.email,
            c.id, c.description, c.code,
            u.id, u.first_name, u.last_name;",
            [$missionId,$userId]
        );
        
    }
  

public function updateAnExecutionRaw($executionId,$raw){
    $execution=Execution::find($executionId);
    return $execution->update($raw)  ? true : false;
    }

    public function hasRelatedData($execution)
    {
        
        $hasRelatedData=$execution->evidences()->exists() ;
        if($hasRelatedData){
            return true;
        }
        return false;
    }
    
    public function deleteExecutions($executionsIds)
{
    $nonDeletable = [];

    foreach ($executionsIds as $id) {
        $execution = Execution::find($id);

        // Si l'exécution a des données liées, on la met dans les non supprimables
        if ($this->hasRelatedData($execution)) {
            $nonDeletable[] = $id;
            continue;
        }

        // Sinon on la supprime
        if ($execution) {
            $execution->delete();
        }
    }

    // Retourner les IDs non supprimables
    return $nonDeletable;
}

public function getExecutionsByMissionAndSystemAndTester($missionId, $userId, $appId)
{
    return DB::select("
         SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
            e.comment AS execution_remark,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
            sts.control_id,

            json_agg( json_build_object(
              'step_execution_id', se.id,
              'step text' , sts.text,
              'step_comment', se.comment,
              'step_checked', se.checked
            )) AS steps,

            json_agg( json_build_object(
              'source_name', so.name
            )) AS sources,

            m.id AS mission_id, 
            mission_name,

            cov.id AS coverage_id,
            cov.risk_id AS coverage_risk_id,
            cov.risk_owner AS risk_owner,
            cov.risk_modification,

            r.id AS risk_id,
            r.name AS risk_name,
            r.code AS risk_code,
            r.description AS risk_description,

            l.id AS layer_id,
            l.name AS layer_name,
            st.id AS status_id,
            st.status_name,

            s.id AS system_id,
            s.name AS system_name,
            o.full_name AS system_owner_full_name,
            o.email AS system_owner_email,
            c.id AS control_id, 
            c.description AS control_description,
            c.code AS control_code,
            mp.description AS major_process,
            sp.name AS sub_process,
            t.name AS type_name,
            u.id AS user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS tester_full_name

        FROM public.missions m
        JOIN public.systems s ON s.mission_id = m.id
        JOIN public.layers l ON l.system_id = s.id
        JOIN public.executions e ON e.layer_id = l.id
        JOIN public.step_executions se ON e.id = se.execution_id
        JOIN public.step_test_scripts sts ON se.step_id = sts.id
        JOIN public.controls c ON c.id = sts.control_id
        JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
        JOIN public.risks r ON r.id = cov.risk_id
        LEFT JOIN public.statuses st ON e.status_id = st.id
        LEFT JOIN public.major_processes mp ON c.major_id = mp.id
        LEFT JOIN public.sub_processes sp ON c.sub_id = sp.id
        LEFT JOIN public.types t ON c.type_id = t.id
        JOIN public.cntrl_srcs cs ON cs.control_id = c.id
        JOIN public.sources so ON cs.source_id = so.id
        JOIN public.users u ON e.user_id = u.id
        JOIN public.owners o ON s.owner_id = o.id
        WHERE m.id = ? and u.id=? and s.id=?

        GROUP BY 
            e.id, e.cntrl_modification, e.comment, e.control_owner, e.launched_at, e.ipe, e.effectiveness, e.design,
            sts.control_id,
            st.id, st.status_name,
            t.name, sp.name, mp.description,
            m.id, mission_name,
            cov.id, cov.risk_id, cov.risk_owner, cov.risk_modification,
            r.id, r.name, r.code, r.description,
            l.id, l.name,
            s.id, s.name,
            o.full_name, o.email,
            c.id, c.description, c.code,
            u.id, u.first_name, u.last_name;",
            [$missionId,$userId,$appId]
        );
    }

    public function updateExecution($executionId, $executionData)
{
    $execution = Execution::where('id',$executionId)->update($executionData); 
    

    return $execution;
}

public function updateExecutionStatus($executionId, $toReview , $toValidate )
{
    $execution = Execution::find($executionId); 

    if (!$execution) {
        return false;
    }

    $execution->is_to_review = $toReview;
    $execution->is_to_validate = $toValidate;
    $execution->touch(); 
    $execution->save();

    return true;
}

  


}
