<?php

namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;

class GeneralAdvancementCalculator implements CalculationServiceInterface
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

        $infos = $this->systemRepository->getMissionGeneralInfos($missionId);

        return [
            'global_advancement' => $infos['global_advancement'],
            //'total_executions' => $infos['total_executions'],
           // 'positionned_executions' => $infos['positionned_executions'],
            'apps' => $infos['apps'],
        ];
    }
}
