<?php

namespace App\Repositories\V1;

use App\Models\Execution;
use App\Models\Mission;
use App\Models\Status;
use App\Models\StepExecution;
use App\Models\StepTestScript;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use League\CommonMark\Node\Query\OrExpr;

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
             e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
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
       LEFT JOIN public.step_executions se ON e.id = se.execution_id
		LEFT JOIN public.step_test_scripts sts ON se.step_id = sts.id

        LEFT JOIN public.controls c ON c.id = sts.control_id
       LEFT  JOIN public.cntrl_risk_covs cov ON e.id = cov.execution_id
       LEFT JOIN public.risks r ON r.id = cov.risk_id
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

//     public function getExecutionById($executionId)
// {
//     return DB::select("
//         SELECT 
//             e.id AS execution_id,
//             sts.control_id,
//             e.is_to_review AS execution_is_to_review,
//             e.is_to_validate AS execution_is_to_validate,
//             e.ipe,
//             e.design,
//             e.effectiveness,
//             e.comment,
//             e.cntrl_modification AS execution_description,
//             e.control_owner AS execution_control_owner,
//             c.description AS control_description,
//             st.id AS status_id,

//             -- Steps ordonnés
//             (
//                 SELECT json_agg(jsonb_build_object(
//                     'step_execution_id', se_inner.id,
//                     'step_text', sts_inner.text,
//                     'step_comment', se_inner.comment,
//                     'step_checked', se_inner.checked
//                 ) ORDER BY se_inner.id)
//                 FROM public.step_executions se_inner
//                 JOIN public.step_test_scripts sts_inner ON se_inner.step_id = sts_inner.id
//                 WHERE se_inner.execution_id = e.id
//             ) AS steps,

//             -- Remarks
//             json_agg(DISTINCT jsonb_build_object(
//                 'id', r.id,
//                 'text', r.text,
//                 'y', r.y,
//                 'initials', UPPER(LEFT(u.first_name, 1) || '' || LEFT(u.last_name, 1)),
//                 'user_id', u.id,
//                 'name', u.first_name || ' ' || u.last_name
//             )) AS remarks,

//             -- Evidences
//             json_agg(DISTINCT jsonb_build_object(
//                 'evidence_id', ev.id,
//                 'file_name', ev.file_name,
//                 'stored_name', ev.stored_name,
//                 'is_f_test', ev.is_f_test
//             )) AS evidences
             

//         FROM public.executions e
//         JOIN public.step_executions se ON e.id = se.execution_id
//         JOIN public.step_test_scripts sts ON se.step_id = sts.id
//         JOIN public.controls c ON c.id = sts.control_id
//         LEFT JOIN public.executions_evidences ev ON ev.execution_id = e.id
//         LEFT JOIN public.remarks r ON r.execution_id = e.id
//         LEFT JOIN public.users u ON r.user_id = u.id
//         LEFT JOIN public.statuses st ON st.id = e.status_id

//         WHERE e.id = ?

//         GROUP BY 
//             e.id,
//             sts.control_id,
//             c.description,
//             st.id
//     ", [$executionId]);
// }
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
            e.cntrl_modification AS execution_description,
            e.control_owner AS execution_control_owner,
            c.description AS control_description,
            c.code AS control_code,
            st.id AS status_id,
            st.status_name AS status_name,
            mp.description AS major_process,
            sp.name AS sub_process,
            t.name AS type_name,

            -- Ajout du systeme
            s.id AS system_id,
            s.name AS system_name,

            -- Ajout de la mission
            m.id AS mission_id,
            m.mission_name AS mission_name,

            -- Steps ordonnés
            (
                SELECT json_agg(jsonb_build_object(
                    'step_execution_id', se_inner.id,
                    'step_text', sts_inner.text,
                    'step_comment', se_inner.comment,
                    'step_checked', se_inner.checked
                ) ORDER BY se_inner.id)
                FROM public.step_executions se_inner
                JOIN public.step_test_scripts sts_inner ON se_inner.step_id = sts_inner.id
                WHERE se_inner.execution_id = e.id
            ) AS steps,

            -- Remarks
            json_agg(DISTINCT jsonb_build_object(
                'id', r.id,
                'text', r.text,
                'y', r.y,
                'initials', UPPER(LEFT(u.first_name, 1) || '' || LEFT(u.last_name, 1)),
                'user_id', u.id,
                'name', u.first_name || ' ' || u.last_name
            )) AS remarks,

            -- Evidences
            json_agg(DISTINCT jsonb_build_object(
                'evidence_id', ev.id,
                'file_name', ev.file_name,
                'stored_name', ev.stored_name,
                'is_f_test', ev.is_f_test
            )) AS evidences,

            -- Sources
            json_agg(DISTINCT jsonb_build_object(
                'source_name', so.name
            )) AS sources,

            -- Remediations
            json_agg(DISTINCT jsonb_build_object(
                'remediation_id', rmd.id,
                'remediation_description', rmd.description,
                'remediation_status_name', rs.status_name
            )) AS remediations

        FROM public.executions e
        JOIN public.step_executions se ON e.id = se.execution_id
        JOIN public.step_test_scripts sts ON se.step_id = sts.id
        JOIN public.controls c ON c.id = sts.control_id
        LEFT JOIN public.executions_evidences ev ON ev.execution_id = e.id
        LEFT JOIN public.remarks r ON r.execution_id = e.id
        LEFT JOIN public.users u ON r.user_id = u.id
        LEFT JOIN public.statuses st ON st.id = e.status_id
        LEFT JOIN public.major_processes mp ON c.major_id = mp.id
        LEFT JOIN public.sub_processes sp ON c.sub_id = sp.id
        LEFT JOIN public.types t ON c.type_id = t.id 
        LEFT JOIN public.remediations rmd ON rmd.execution_id = e.id
        LEFT JOIN public.statuses rs ON rmd.status_id = rs.id
        LEFT JOIN public.cntrl_srcs cs ON cs.control_id = c.id
        LEFT JOIN public.sources so ON cs.source_id = so.id

        -- Ajout des jointures pour récupérer le system et la mission
        JOIN public.layers l ON e.layer_id = l.id
        JOIN public.systems s ON l.system_id = s.id
        JOIN public.missions m ON s.mission_id = m.id

        WHERE e.id = ?

        GROUP BY 
            e.id,
            sts.control_id,
            c.description,
            c.code,
            st.id, st.status_name,
            mp.description,
            sp.name,
            t.name,
            s.id, s.name,
            m.id, m.mission_name
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
         e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
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
    AND e.is_to_review = false
                AND e.is_to_validate = false
                AND e.status_id IS  NULL
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

    public function getAllExecutionsByApp($appId)
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
            e.is_to_review AS execution_is_to_review,
            e.is_to_validate AS execution_is_to_validate,
            sts.control_id,
    
            json_agg(DISTINCT jsonb_build_object(
              'step_execution_id', se.id,
              'step text' , sts.text,
              'step_comment', se.comment,
              'step_checked', se.checked
            )) AS steps,
    
            json_agg(DISTINCT jsonb_build_object(
              'source_name', so.name
            )) AS sources,
    
            json_agg(DISTINCT jsonb_build_object(
                'remediation_id', rmd.id,
                'remediation_description', rmd.description,
                'remediation_status_name', rs.status_name
            )) AS remediations,
    
            json_agg(DISTINCT jsonb_build_object(
                'remark_id', rm.id,
                'remark_text', rm.text,
                'remark_y', rm.y,
                'remark_user_id', rm.user_id
            )) AS remarks,
    
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
        LEFT JOIN public.remediations rmd ON rmd.execution_id = e.id
        LEFT JOIN public.statuses rs ON rmd.status_id = rs.id
        LEFT JOIN public.remarks rm ON rm.execution_id = e.id
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




    public function getExecutionsByMissionAndTester($missionId, $userId)
    {
        //e.comment AS execution_remark,
        return DB::select(
            "
         SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
            e.comment AS execution_comment,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
             e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
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
            [$missionId, $userId]
        );
    }


    public function updateAnExecutionRaw($executionId, $raw)
    {
        $execution = Execution::find($executionId);
        return $execution->update($raw)  ? true : false;
    }

    public function hasRelatedData($execution)
    {

        $hasRelatedData = $execution->evidences()->exists();
        if ($hasRelatedData) {
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

    public function getsystemIdByExecutionIdAndMissionIdAndLayerId($layerId, $executionId)
    {
        $results = DB::select(
            "
            SELECT 
                e.id AS execution_id, 
                e.cntrl_modification AS execution_modification,
                e.comment AS execution_comment,
                e.control_owner AS execution_control_owner,
                m.id AS mission_id, 
                mission_name,
                l.id AS layer_id,
                l.name AS layer_name,
                st.id AS status_id,
                st.status_name,
                s.id AS system_id,
                s.name AS system_name,
                o.full_name AS system_owner_full_name,
                o.email AS system_owner_email,
                u.id AS user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS tester_full_name
            FROM public.missions m
            JOIN public.systems s ON s.mission_id = m.id
            JOIN public.layers l ON l.system_id = s.id
            JOIN public.executions e ON e.layer_id = l.id
            LEFT JOIN public.statuses st ON e.status_id = st.id
            JOIN public.users u ON e.user_id = u.id
            JOIN public.owners o ON s.owner_id = o.id
            WHERE 
               l.id = ?
                AND e.id = ?
            GROUP BY 
                e.id, e.cntrl_modification, e.comment, e.control_owner, e.launched_at, e.ipe, e.effectiveness, e.design,
                st.id, st.status_name,
                m.id, mission_name,
                l.id, l.name,
                s.id, s.name,
                o.full_name, o.email,
                u.id, u.first_name, u.last_name
            ",
            [$layerId, $executionId]
        );
    
        return $results[0] ?? null;  // Retourne le premier résultat ou null si vide
    }
    
    public function getExecutionsByMissionAndSystemAndTester($missionId, $userId, $appId)
    {
        // e.comment AS execution_remark,
        return DB::select(
            "
         SELECT 
            e.id AS execution_id, 
            e.cntrl_modification AS execution_modification,
           
            e.comment AS execution_comment,
            e.control_owner AS execution_control_owner,
            e.launched_at AS execution_launched_at,
            e.ipe AS execution_ipe,
            e.effectiveness AS execution_effectiveness,
            e.design AS execution_design,
            e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
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

            json_agg(DISTINCT jsonb_build_object(
                'remediation_id', rmd.id,
                'remediation_description', rmd.description,
                'remediation_status_name', rs.status_name
            )) AS remediations,
    
            json_agg(DISTINCT jsonb_build_object(
                'remark_id', rm.id,
                'remark_text', rm.text,
                'remark_y', rm.y,
                'remark_user_id', rm.user_id
            )) AS remarks,

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
        LEFT JOIN public.remediations rmd ON rmd.execution_id = e.id
        LEFT JOIN public.statuses rs ON rmd.status_id = rs.id
        LEFT JOIN public.remarks rm ON rm.execution_id = e.id

       
        
        JOIN public.cntrl_srcs cs ON cs.control_id = c.id
        JOIN public.sources so ON cs.source_id = so.id
        JOIN public.users u ON e.user_id = u.id
        JOIN public.owners o ON s.owner_id = o.id
       
        WHERE 
    m.id = ?
    AND u.id = ?
    AND s.id = ?
    AND (
        (
            (e.is_to_review = false AND e.is_to_validate = false)
            AND NOT EXISTS (
                SELECT 1 FROM public.remarks rm WHERE rm.execution_id = e.id
            )
        )
        OR (e.is_to_review = true AND e.is_to_validate = false)
        OR (e.is_to_review = true AND e.is_to_validate = true)
        OR (e.is_to_review = false AND e.is_to_validate = true)
    )
     

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
            [$missionId, $userId, $appId]
        );
    }

    public function getExecutionsByMissionAndSystemAndTesterFiltered($missionId, $userId, $appId)
    {
        return DB::select(
            "
             SELECT 
                e.id AS execution_id, 
                e.cntrl_modification AS execution_modification,
              e.comment AS execution_comment,
                e.control_owner AS execution_control_owner,
                e.launched_at AS execution_launched_at,
                e.ipe AS execution_ipe,
                e.effectiveness AS execution_effectiveness,
                e.design AS execution_design,
                e.is_to_review AS execution_is_to_review,
    e.is_to_validate AS execution_is_to_validate,
                sts.control_id,
    
                json_agg( json_build_object(
                  'step_execution_id', se.id,
                  'step_text' , sts.text,
                  'step_comment', se.comment,
                  'step_checked', se.checked
                )) AS steps,
    
                json_agg( json_build_object(
                  'source_name', so.name
                )) AS sources,

                json_agg(DISTINCT jsonb_build_object(
                'remediation_id', rmd.id,
                'remediation_description', rmd.description,
                'remediation_status_name', rs.status_name
            )) AS remediations,
    
            json_agg(DISTINCT jsonb_build_object(
                'remark_id', rm.id,
                'remark_text', rm.text,
                'remark_y', rm.y,
                'remark_user_id', rm.user_id
            )) AS remarks,
    
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
            LEFT JOIN public.remediations rmd ON rmd.execution_id = e.id
        LEFT JOIN public.statuses rs ON rmd.status_id = rs.id
        LEFT JOIN public.remarks rm ON rm.execution_id = e.id
        
            JOIN public.cntrl_srcs cs ON cs.control_id = c.id
            JOIN public.sources so ON cs.source_id = so.id
            JOIN public.users u ON e.user_id = u.id
            JOIN public.owners o ON s.owner_id = o.id
    
            WHERE 
                m.id = ?
                AND u.id = ?
                AND s.id = ?
                 AND (
        (e.is_to_review = false AND e.is_to_validate = false)
        AND
       EXISTS (
        SELECT 1 FROM public.remarks rm WHERE rm.execution_id = e.id
    )
    )
                AND e.status_id IS NOT NULL
    
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
                u.id, u.first_name, u.last_name
            ",
            [$missionId, $userId, $appId]
        );
    }

    public function updateExecution($executionId, $executionData)
    {
        $execution = Execution::where('id', $executionId)->update($executionData);
        return $execution;
    }

    public function updateExecutionStatus($executionId, $toReview, $toValidate)
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
    //superviseur
    public function getexecutionReviewBySuperviseur($missionId)
    {
        return Execution::with([
            'user',
            'user.participations.profile',
            'status',
            'layer',
            'layer.system',
            'layer.system.mission',
            'coverage',
            'steps.control'
        ])
            ->where('is_to_review', true)
            ->where('is_to_validate', false)
            ->whereHas('layer.system.mission', function ($query) use ($missionId) {
                $query->where('id', $missionId);
            })
            ->get();
    }
    //admin
    public function getAllExecutionReview($missionId)
    {
        return Execution::with([
            'user',
            'user.participations.profile',
            'status',
            'layer',
            'layer.system',
            'layer.system.mission',
            'coverage',
            'steps.control'
        ])
            ->where(function ($query) {
                $query->where('is_to_review', true)
                    ->orWhere('is_to_validate', true);
            })
            ->whereHas('layer.system.mission', function ($query) use ($missionId) {
                $query->where('id', $missionId);
            })
           
            ->get();
    }

    public function getAllExecutionReviewAdmin($missionId, $appId)
    {
        return Execution::with([
            'user',
            'user.participations.profile',
            'status',
            'layer',
            'layer.system',
            'layer.system.mission',
            'coverage',
            'steps.control'
        ])
            ->where(function ($query) {
                $query->where('is_to_review', true)
                    ->orWhere('is_to_validate', true);
            })
            ->whereHas('layer.system.mission', function ($query) use ($missionId) {
                $query->where('id', $missionId);
            })
            ->whereHas('layer.system', function ($query) use ($appId) {
                $query->where('id', $appId);
            })
            ->get();
    }


    // public function getmissionReviewBySuperviseur()
    // {
    //     return  $missions = Mission::whereHas('systems.layers.executions', function ($query) {
    //         $query
    //         ->where('is_to_review', true)
    //         ->where('is_to_validate', false);
    //     })
    //     ->with([
    //         'client',
    //         'status',
    //         'participations.user',
    //         'participations.profile',
    //     ])
    //     ->get();
    // }

    public function getmissionReviewBySuperviseur($userId)
    {

        return Mission::whereHas('systems.layers.executions', function ($query) {
            $query->where('is_to_review', true)
                ->where('is_to_validate', false);
        })
            ->whereHas('participations', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->whereHas('profile', function ($q) {
                        $q->where('profile_name', 'superviseur'); // ou selon la logique métier exacte
                    });
            })
            ->with([
                'client',
                'status',
                'participations.user',
                'participations.profile',
            ])
            ->get();
    }



    //manager
    public function getexecutionReviewByManager($missionId)
    {
        return Execution::with([
            'user',
            'user.participations.profile',
            'status',
            'layer',
            'layer.system',
            'layer.system.mission',
            'coverage',
            'steps.control'
        ])->where('is_to_review', false)
            ->where('is_to_validate', true)
            ->whereHas('layer.system.mission', function ($query) use ($missionId) {
                $query->where('id', $missionId);
            })
            ->get();
    }

    // public function getmissionReviewManager($userId)
    // {
    //     return  $missions = Mission::whereHas('systems.layers.executions', function ($query) {
    //         $query
    //         ->where('is_to_review', false)
    //         ->where('is_to_validate', true);
    //     })
    //     ->with([
    //         'client',
    //         'status',
    //         'participations.user',
    //         'participations.profile',
    //     ])
    //     ->get();
    // }

    public function getmissionReviewManager($userId)
    {
        return Mission::whereHas('systems.layers.executions', function ($query) {
            $query->where('is_to_review', false)
                ->where('is_to_validate', true);
        })
            ->whereHas('participations', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->whereHas('profile', function ($q) {
                        $q->where('profile_name', 'manager'); // ou selon la logique métier exacte
                    });
            })
            ->with([
                'client',
                'status',
                'participations.user',
                'participations.profile',
            ])
            ->get();
    }


    public function getmissionReviewManage1($userId)
    {
        // Charger l'utilisateur avec ses participations et profils
        $user = User::with('participations.profile')->find($userId);
        logger()->info('User:', [$user]);

        // Extraire les noms de profil (manager, superviseur, etc.)
        $profiles = $user->participations->pluck('profile.profile_name')->unique()->toArray();
        logger()->info('Profils de l\'utilisateur:', $profiles);

        // Filtrer pour ne garder que manager ou superviseur
        $validProfiles = ['manager', 'superviseur'];
        $userProfiles = array_intersect($profiles, $validProfiles);

        if (empty($userProfiles)) {
            logger()->info('Aucun profil manager ou superviseur trouvé.');
            return collect();
        }

        // Récupérer les missions qui matchent les conditions d'exécution ET la participation de l'utilisateur
        $missions = Mission::whereHas('systems.layers.executions', function ($query) {
            $query->where(function ($q) {
                $q->where('is_to_review', true)
                    ->where('is_to_validate', false);
            })->orWhere(function ($q) {
                $q->where('is_to_review', false)
                    ->where('is_to_validate', true);
            });
        })
            ->whereHas('participations', function ($query) use ($userId, $userProfiles) {
                $query->where('user_id', $userId)
                    ->whereHas('profile', function ($q) use ($userProfiles) {
                        $q->whereIn('profile_name', $userProfiles);
                    });
            })
            ->with([
                'client',
                'status',
                'participations.user',
                'participations.profile',
            ])
            ->get();

        logger()->info('Missions récupérées:', $missions->toArray());

        return $missions;
    }




    //validation finale
    //manager
    public function getexecutionReview()
    {
        return Execution::with([
            'user',
            'user.participations.profile',
            'status',
            'layer',
            'layer.system',
            'layer.system.mission',
            'coverage',
            'steps.control'
        ])->where('is_to_review', true)
            ->where('is_to_validate', true)
            ->get();
    }

    public function getmissionReview()
    {
        return  $missions = Mission::whereHas('systems.layers.executions', function ($query) {
            $query
                ->where('is_to_review', true)
                ->where('is_to_validate', true);
        })
            ->with([
                'client',
                'status',
                'participations.user',
                'participations.profile',
            ])
            ->get();
    }


    public function getEffectiveExecutionsByMission($id)
{
    $results = DB::select('
        SELECT 
            DISTINCT cnt.id,
            m.id,
            cnt.code,
            COALESCE(NULLIF(e.cntrl_modification, \'\'), cnt.description) AS description,
            e.control_owner AS owner,
            stt.status_name AS status,
            e.id AS id,
            l.name AS layer,
            CONCAT(u.first_name, \' \', u.last_name) AS testeur
        FROM public.missions m 
        JOIN public.systems s ON s.mission_id = m.id
        LEFT JOIN public.layers l ON s.id = l.system_id
        JOIN public.executions e ON e.layer_id = l.id
        LEFT JOIN public.statuses stt ON stt.id = e.status_id
        JOIN public.step_executions ON step_executions.execution_id = e.id
        JOIN public.step_test_scripts ON step_test_scripts.id = step_executions.step_id
        JOIN public.controls cnt ON cnt.id = step_test_scripts.control_id
        JOIN public.users u ON u.id = e.user_id
        WHERE stt.status_name = \'applied\' AND m.id = ?
        ORDER BY m.id
    ', [$id]);

    return $results;
}
public function getIneffectiveExecutionsByMission($id)
{
    $results = DB::select('
        SELECT 
        DISTINCT cnt.id,
            m.id,
            cnt.code,
            COALESCE(NULLIF(e.cntrl_modification, \'\'), cnt.description) AS description,
            e.control_owner AS owner,
            stt.status_name AS status,
            l.name AS layer,
             e.id AS id,
            CONCAT(u.first_name, \' \', u.last_name) AS testeur
        FROM public.missions m 
        JOIN public.systems s ON s.mission_id = m.id
        LEFT JOIN public.layers l ON s.id = l.system_id
        JOIN public.executions e ON e.layer_id = l.id
        LEFT JOIN public.statuses stt ON stt.id = e.status_id
        JOIN public.step_executions ON step_executions.execution_id = e.id
        JOIN public.step_test_scripts ON step_test_scripts.id = step_executions.step_id
        JOIN public.controls cnt ON cnt.id = step_test_scripts.control_id
        JOIN public.users u ON u.id = e.user_id
        WHERE stt.status_name IS DISTINCT FROM \'applied\'  AND stt.status_name IS NOT NULL 

        AND m.id = ?
        ORDER BY cnt.code
    ', [$id]);

    return $results;
}



public function getBeganExecutionsByMission($id)
{
    return DB::select(
        "SELECT DISTINCT e.id AS id,
            cnt.code,
            s.name AS system_name,
            COALESCE(NULLIF(e.cntrl_modification, ' '), cnt.description) AS description,
            e.control_owner AS owner,
            stt.status_name AS status,
            l.name AS layer,
            CONCAT(u.first_name, ' ', u.last_name) AS testeur
        FROM public.missions m 
        JOIN public.systems s ON s.mission_id = m.id
        LEFT JOIN public.layers l ON s.id = l.system_id
        JOIN public.executions e ON e.layer_id = l.id
        LEFT JOIN public.statuses stt ON stt.id = e.status_id
        JOIN public.step_executions ON step_executions.execution_id = e.id
        JOIN public.step_test_scripts ON step_test_scripts.id = step_executions.step_id
        JOIN public.controls cnt ON cnt.id = step_test_scripts.control_id
        JOIN public.users u ON u.id = e.user_id
        WHERE e.launched_at IS NOT NULL AND m.id = ?
        ORDER BY cnt.code", [$id]
    );
}

public function getUnbeganExecutionsByMission($id)
{
    return DB::select(
        "SELECT DISTINCT e.id AS id,
            cnt.code,
            s.name AS system_name,
            COALESCE(NULLIF(e.cntrl_modification, ' '), cnt.description) AS description,
            e.control_owner AS owner,
            stt.status_name AS status,
            l.name AS layer,
            CONCAT(u.first_name, ' ', u.last_name) AS testeur
        FROM public.missions m 
        JOIN public.systems s ON s.mission_id = m.id
        LEFT JOIN public.layers l ON s.id = l.system_id
        JOIN public.executions e ON e.layer_id = l.id
        LEFT JOIN public.statuses stt ON stt.id = e.status_id
        JOIN public.step_executions ON step_executions.execution_id = e.id
        JOIN public.step_test_scripts ON step_test_scripts.id = step_executions.step_id
        JOIN public.controls cnt ON cnt.id = step_test_scripts.control_id
        JOIN public.users u ON u.id = e.user_id
        WHERE e.launched_at IS NULL AND m.id = ?
        ORDER BY cnt.code", [$id]
    );
}

}
