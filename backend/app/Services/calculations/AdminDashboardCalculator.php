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
            'nbrControl' => (string) $m->total_executions,
            'startDate' => $m->start_date,
            'endDate' => $m->end_date,
           
            'controlCommencé' => [
                'pourcentageTotale' => (string) round(($m->launched_executions / $totalExec) * 100),
                'pourcentageFinalisé' => (string) round(($m->finalized_executions / $totalExec) * 100),
                'pourcentageNonFinalisé' => (string) round(($m->not_finalized_executions / $totalExec) * 100),
            ],
            'controlNonCommencé' => (string) round(($m->not_launched_executions / $totalExec) * 100),
            'controlEffectif' => (string) round(($m->effective_controls / max(1, $totalCtrl)) * 100),
            'controlNonEffective' => [
                'pourcentageTotale' => (string) round(($m->noneffective_controls / max(1, $totalCtrl)) * 100),
                'partiallyApp' => (string) round(($m->partially_applied_controls / max(1, $totalCtrl)) * 100),
                'notApp' => (string) round(($m->not_applied_controls / max(1, $totalCtrl)) * 100),
                'notTested' => (string) round(($m->not_tested_controls / max(1, $totalCtrl)) * 100),
                'notApplicable' => (string) round(($m->not_applicable_controls / max(1, $totalCtrl)) * 100),
            ],
        ];
    });

    return $formatted->toArray();
}




    
}
