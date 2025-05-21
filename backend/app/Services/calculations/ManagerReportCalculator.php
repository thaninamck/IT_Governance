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
        'controlCommencé' => $first['control_commence'] ?? 0,
        'controlNonCommencé' => $first['control_non_commence'] ?? 0,
        'controlEffectif' => $first['controls_effectifs'] ?? 0,
        'controlNonEffectif' => $first['controls_ineffectifs'] ?? 0,

        // actions = remediations
        'nbrAction' => $first['total_remediations'] ?? 0,
        'actionTerminé' => $first['total_finished_remediations'] ?? 0,
        'actionEnCours' => $first['total_ongoing_remediations'] ?? 0,

        'executions' => collect($executions)->map(function ($item) {
            return [
                'execution_id' => $item['execution_id'],
                'remediations' => [
                    'en_cours' => $item['ongoing_remediations'],
                    'termine' => $item['finished_remediations'],
                    'total' => $item['total_remediations'],
                ],
            ];
        })->values()->all(),
    ];
}

    





    
}
