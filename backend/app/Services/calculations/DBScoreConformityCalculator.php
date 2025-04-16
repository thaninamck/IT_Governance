<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class DBScoreConformityCalculator implements CalculationServiceInterface
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

    // On suppose que cette méthode récupère les exécutions de toutes les couches pour chaque application
    $executions = $this->systemRepository->getDBLayerExecutionsWithTheirStatusesByMission($missionId);

    $appScores = [];

    foreach ($executions as $exec) {
        $appName = $exec->application;
        $status = strtolower($exec->status);
        $weight = $this->strategy->getWeight($status);

        // Initialiser l'entrée pour l'application si elle n'existe pas encore
        if (!isset($appScores[$appName])) {
            $appScores[$appName] = [
                'total' => 0,
                'score' => 0,
            ];
        }

        // Si le contrôle est valide (ni "n/a" ni "not tested"), on l'inclut dans le total
        if (!in_array($status, ['n/a', 'not tested (0 occurrence)'])) {
            $appScores[$appName]['total']++;
            $appScores[$appName]['score'] += $weight;
        }
    }

    // Préparer le tableau de résultats
    $results = [];
    foreach ($appScores as $appName => $data) {
        $finalScore = $data['total'] > 0
            ? round(($data['score'] / $data['total']) * 100, 1)
            : 0;

        $results[] = [
            'name' => $appName,
            'score' => $finalScore,
        ];
    }

    return $results;
}



    
}
