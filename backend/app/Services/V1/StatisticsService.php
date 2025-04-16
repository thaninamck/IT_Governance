<?php

namespace App\Services\V1;

use App\Repositories\V1\SystemRepository;
use App\Services\calculations\AppScoreConformityCalculator;
use App\Services\calculations\calculationWeightsStrategies\DefaultStatusWeightStrategy;

class StatisticsService
{
    protected AppScoreConformityCalculator $appConformityCalculator;

    public function __construct()
    {
        // On instancie d'abord les dépendances
        $systemRepository = new SystemRepository();
        $strategy = new DefaultStatusWeightStrategy();

        // Puis on instancie le calculateur avec ses dépendances
        $this->appConformityCalculator = new AppScoreConformityCalculator($systemRepository, $strategy);
    }

    public function missionReportCalculate($missionId)
    {
        $data['mission_id'] = $missionId;
        return $this->appConformityCalculator->calculate($data);
    }
}
