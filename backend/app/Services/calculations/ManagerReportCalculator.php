<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\MissionRepository;

class ManagerReportCalculator implements CalculationServiceInterface
{
    protected MissionRepository $missionRepository;

    public function __construct(MissionRepository $missionRepository)
    {
        $this->missionRepository = $missionRepository;
        
    }

    public function calculate($data): array
{
    $missionId = $data['mission_id'];
    $raw = collect(json_decode(json_encode($this->missionRepository->getManagerMissionReport($missionId)), true));
    $first = $raw->first();

    $executions = json_decode($first['repartition_par_execution'] ?? '[]', true);

    return [
        'mission_id' => $missionId,
        'mission_name' => $first['mission'] ?? null,
        'start_date' => $first['start_date'] ?? null,
        'end_date' => $first['end_date'] ?? null,
        'client' => $first['client'] ?? null,
        'nbrControl' => $first['nbr_control'] ?? 0,
        'nbrControlWithActions' => $first['nbr_control_with_actions'] ?? 0,
        
        'controlEffectif' => round( (($first['controls_effectifs'] ?? 0) / max(1, $first['nbr_control'])) * 100 ), // pourcentage des controles effectifs
'controlNonEffectif' => round( (($first['controls_ineffectifs'] ?? 0) / max(1, $first['nbr_control'])) * 100 ), // pourcentage des controles ineffectifs

'controlCommencé' => round( (($first['control_commence'] ?? 0) / max(1, $first['nbr_control'])) * 100 ),


        'controlNonCommencé' => round($first['control_non_commence'] ?? 0) / max(1, $first['nbr_control']) * 100, // pourcentage des controles non commencés
        'controlFinalisé' => $first['controls_finalises'] ?? 0,
        'controlNonFinalisé' => $first['controls_non_finalises'] ?? 0, 

// Statuts d'exécution avec pourcentages
'executionsNotAppliedPct' => round((($first['executions_not_applied'] ?? 0) / max(1, $first['nbr_control'])) * 100),
'executionsPartiallyAppliedPct' => round((($first['executions_partially_applied'] ?? 0) / max(1, $first['nbr_control'])) * 100),
'executionsNotTestedPct' => round((($first['executions_not_tested'] ?? 0) / max(1, $first['nbr_control'])) * 100),
'executionsNotApplicablePct' => round((($first['executions_not_applicable'] ?? 0) / max(1, $first['nbr_control'])) * 100),


        // actions = remediations
        'nbrAction' => $first['total_remediations'] ?? 0,
        'actionTerminé' => round($first['total_finished_remediations'] / max(1, $first['total_remediations']) * 100) ,
        'actionEnCours' => round($first['total_ongoing_remediations'] / max(1, $first['total_remediations']) * 100) ,

        'executions' => collect($executions)->map(function ($item) {
            return [
                'execution_id' => $item['execution_id'],
                'control_code' => $item['control_code'],
                
                'remediations' => [
                    'en_cours' => round(($item['ongoing_remediations'] / max(1,$item['total_remediations'])) * 100),
                    'termine' => round(($item['finished_remediations'] / max (1,$item['total_remediations'])) * 100),
                   
                    'total' => $item['total_remediations'],
                ],
            ];
        })->values()->all(),
    ];
}

    





    
}
