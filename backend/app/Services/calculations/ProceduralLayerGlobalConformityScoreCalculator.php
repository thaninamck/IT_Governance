<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class ProceduralLayerGlobalConformityScoreCalculator implements CalculationServiceInterface
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
        $missionId = $data['mission_id'];
        $executions = $this->systemRepository->getProceduralExecutionsWithTheirStatusesByMission($missionId);

        $scoreSum = 0;
        $totalControls = 100; // Fixe selon la formule

        foreach ($executions as $exec) {
            $status = strtolower($exec->status);

            // Ignore "n/a" ou "not tested" si besoin (pas mentionné dans ta formule Excel, mais à toi de voir si nécessaire)
            if ($status === 'n/a' || $status === 'not tested (0 occurrence)') {
                continue;
            }

            $weight = $this->strategy->getWeight($exec->status);
            $scoreSum += $weight;
        }

        $score = round(($scoreSum / $totalControls) * 100, 1); // En pourcentage

        return [
            
                "name" => "Procédurale",
                "score" => $score
            
        ];
    }
}
