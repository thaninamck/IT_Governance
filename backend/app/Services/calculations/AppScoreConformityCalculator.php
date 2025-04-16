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

    // Initialisation d'un tableau pour stocker les scores par application
    $appScores = [];

    // Parcourir les exécutions pour appliquer la logique de calcul
    foreach ($executions as $exec) {
        $appName = $exec->application; // Nom de l'application
        $status = $exec->status;

        // Appliquer le poids du statut à l'aide de la stratégie
        $weight = $this->strategy->getWeight($status);

        // Si le poids est 0.0, on ignore cette exécution
        if ($weight === 0.0) {
            continue;
        }

        // Si l'application n'est pas encore dans le tableau, on l'initialise
        if (!isset($appScores[$appName])) {
            $appScores[$appName] = [
                'total' => 0, // Nombre d'exécutions pour cette application
                'score' => 0, // Total des poids pour cette application
            ];
        }

        // Ajouter le poids au total de l'application
        $appScores[$appName]['total']++;
        $appScores[$appName]['score'] += $weight;
    }

    // Transformer en tableau d'objets [name => ..., score => ...]
    $results = [];
    foreach ($appScores as $appName => $data) {
        // Calculer le score final de chaque application
        $finalScore = $data['total'] > 0
            ? round(($data['score'] / $data['total']) * 100, 1) // % sur 100
            : 0;

        // Ajouter au tableau des résultats
        $results[] = [
            'name' => $appName,
            'score' => $finalScore,
        ];
    }

    // Retourner le tableau des résultats
    return $results;
}


    
}
