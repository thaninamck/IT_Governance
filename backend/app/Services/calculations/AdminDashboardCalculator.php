<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\MissionRepository;

class AdminDashboardCalculator implements CalculationServiceInterface
{
    protected MissionRepository $missionRepository;

    public function __construct(MissionRepository $missionRepository)
    {
        $this->missionRepository = $missionRepository;
        
    }

    public function calculate($data): array
{
    $missions = collect($this->missionRepository->getMissionsInprogress());

    $formatted = $missions->map(function ($m) {
        // Sécurité : éviter division par 0
        $totalExec = max(1, $m->total_executions);
        $totalCtrl = $m->effective_controls + $m->noneffective_controls;

        return [
            'id' => (string) $m->id,
            'missionName' => $m->mission,
            'client' => $m->client,
            'nbrControl' =>  $m->total_executions,
            'startDate' => $m->start_date,
            'endDate' => $m->end_date,
           
            'controlCommencé' => [
                'nbrTotale' => $m->launched_executions ,
                'nbrFinalisé' => $m->finalized_executions ,
                'nbrNonFinalisé' => $m->not_finalized_executions ,
            ],
            'controlNonCommencé' =>  round(($m->not_launched_executions * 100)/ $totalExec),
            'controlEffectif' =>  round(($m->effective_controls * 100) /  $totalExec),
            'controlNonEffective' => [
                'pourcentageTotale' =>  round(($m->noneffective_controls / max(1, $totalExec)) * 100),
                'nbrPartially' => $m->partially_applied_controls,
                'partiallyApp' =>  round(($m->partially_applied_controls / max(1, $totalExec)) * 100),
                'notApp' =>  round(($m->not_applied_controls / max(1, $totalExec)) * 100),
                'notTested' =>  round(($m->not_tested_controls / max(1, $totalExec)) * 100),
                'notApplicable' =>  round(($m->not_applicable_controls / max(1,$totalExec) ) * 100),
            ],
        ];
    });

    return $formatted->toArray();
}




    
}
