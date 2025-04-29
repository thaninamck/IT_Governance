<?php
namespace App\Services\calculations\calculationWeightsStrategies;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;
class DefaultStatusWeightStrategy implements StatusWeightStrategyInterface
{
    public function getWeight(string $status): float
    {
        return match (strtolower($status)) {
            'applied' => 1.0,
            'partially applied' => 0.5,
            'in implementation' => 0.25,
            'n/a', 'not tested (0 occurrence)' => 0.0,
            default => 0.0
        };
    }
}
