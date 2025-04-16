<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class AppScoreConformityCalculator implements CalculationServiceInterface
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
    $executions = $this->systemRepository->getSystemExecutionsWithTheirStatusesByMission($missionId);

    $appScores = [];

    foreach ($executions as $exec) {
        $appName = $exec->application; // conserve le nom tel qu'il est (ex: "SNOC_APP")
        $status = $exec->status;
        $weight = $this->strategy->getWeight($status);

        if (!isset($appScores[$appName])) {
            $appScores[$appName] = [
                'total' => 0,
                'score' => 0,
            ];
        }

        if ($weight === 0.0) {
            continue;
        }

        $appScores[$appName]['total']++;
        $appScores[$appName]['score'] += $weight;
    }

    // Transformer en tableau d'objets [name => ..., score => ...]
    $results = [];

    foreach ($appScores as $appName => $data) {
        $finalScore = $data['total'] > 0
            ? round(($data['score'] / $data['total']) * 100, 1) // % sur 100
            : 0;

        $results[] = [
            'name' => $appName,
            'score' => $finalScore,
        ];
    }

    return $results;
}

    
}
