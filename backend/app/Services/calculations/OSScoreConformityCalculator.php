<?php
namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class OSScoreConformityCalculator implements CalculationServiceInterface
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

    // Récupère les exécutions des 4 couches concernées
    $executions = $this->systemRepository->getOSLayerExecutionsWithTheirStatusesByMission($missionId);

    $appScores = [];

    foreach ($executions as $exec) {
        $appName = $exec->application;
        $couche = strtolower($exec->couche);
        $status = strtolower($exec->status);

        // Initialisation si c'est la première fois qu'on voit cette app
        if (!isset($appScores[$appName])) {
            $appScores[$appName] = [
                'numerateur' => 0,
                'denominateur' => 0,
            ];
        }

        // 🎯 Couche OS : statuts pondérés dans le numérateur + dénominateur (sauf N/A et Not tested)
        if ($couche === 'système d\'exploitation') {
            $weight = $this->strategy->getWeight($status);
            if ($status !== 'n/a' && $status !== 'not tested (0 occurrence)') {
                $appScores[$appName]['numerateur'] += $weight;
                $appScores[$appName]['denominateur'] += 1;
            }
        }

        // 🧩 Couche Procédurale : uniquement Applied dans numérateur + tous les contrôles dans dénominateur
        elseif ($couche === 'procédurale') {
            if ($status === 'applied') {
                $appScores[$appName]['numerateur'] += 1;
            }
            $appScores[$appName]['denominateur'] += 1;
        }

        // 🧱 Couche Sécurité physique & environnementale
        elseif ($couche === 'sécurité physique & environnementale') {
            if ($status === 'applied') {
                $appScores[$appName]['numerateur'] += 1;
            } elseif ($status === 'partially applied') {
                $appScores[$appName]['numerateur'] += 0.5;
            }
            $appScores[$appName]['denominateur'] += 1;
        }

        // 🗄️ Couche Bases de données : uniquement pour le dénominateur
        elseif ($couche === 'bases de données') {
            $appScores[$appName]['denominateur'] += 1;
        }
    }

    // 💯 Calcul du score final par application
    $results = [];
    foreach ($appScores as $app => $data) {
        $score = $data['denominateur'] > 0
            ? round(($data['numerateur'] / $data['denominateur']) * 100, 1)
            : 0;

        $results[] = [
            'name' => $app,
            'score' => $score,
        ];
    }

    return $results;
}


    
}
