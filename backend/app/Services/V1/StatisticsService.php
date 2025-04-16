<?php

namespace App\Services\V1;

use App\Repositories\V1\SystemRepository;
use App\Services\calculations\AppScoreConformityCalculator;
use App\Services\calculations\CalculationServiceInterface;
use App\Services\calculations\calculationWeightsStrategies\DefaultStatusWeightStrategy;

class StatisticsService
{
    /**
     * @var CalculationServiceInterface[]
     */
    protected array $calculators;

    public function __construct()
    {
        $systemRepository = new SystemRepository();

        $this->calculators = [
            'app_conf_score' => new AppScoreConformityCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            // 'risk_score' => new RiskScoreCalculator(...),
            // Tu peux en rajouter d'autres ici
        ];
    }

    public function calculate(string $type, $data)
    {
        if (!isset($this->calculators[$type])) {
            throw new \InvalidArgumentException("Unknown calculation type: $type");
        }

        return $this->calculators[$type]->calculate($data);
    }

    public function listCalculations(): array
    {
        return array_keys($this->calculators);
    }
}

