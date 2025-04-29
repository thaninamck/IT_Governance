<?php
namespace App\Services\calculations\calculationWeightsStrategies;

interface StatusWeightStrategyInterface
{
    public function getWeight(string $status): float;
}
