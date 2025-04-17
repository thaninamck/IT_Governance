<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class PhysicalLayerGlobalConformityScoreCalculator implements CalculationServiceInterface
{
    protected SystemRepository $systemRepository;
    protected StatusWeightStrategyInterface $strategy;

    public function __construct(SystemRepository $systemRepository, StatusWeightStrategyInterface $strategy)
    {
        $this->systemRepository = $systemRepository;
        $this->strategy = $strategy;
    }

    public function calculate($data)
    {
        // score = (nb_applied + 0.5 * nb_partially_applied) / (24 - nb_na)
        $missionId = $data['mission_id'];

        $executions = $this->systemRepository->getPhysicalExecutionsWithTheirStatusesByMission($missionId);

        $scoreSum = 0;
        $nbNA = 0;
        $totalControls = 24;

        foreach ($executions as $exec) {
            $status = strtolower($exec->status);

            if ($status === 'n/a' || $status === 'not tested (0 occurrence)') {
                $nbNA++;
                continue;
            }

            $weight = $this->strategy->getWeight($exec->status);
            $scoreSum += $weight;
        }

        $denominator = $totalControls - $nbNA;
        $score = $denominator > 0 ? round(($scoreSum / $denominator) * 100, 1) : 0;

        return [
           
                "name" => "Sécurité physique & environnementale",
                "score" => $score
            
        ];
    }
}
