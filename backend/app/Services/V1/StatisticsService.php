<?php

namespace App\Services\V1;

use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\SystemRepository;
use App\Services\Calculations\AdminDashboardCalculator;
use App\Services\calculations\AppScoreConformityCalculator;
use App\Services\calculations\CalculationServiceInterface;
use App\Services\calculations\calculationWeightsStrategies\DefaultStatusWeightStrategy;
use App\Services\Calculations\DBScoreConformityCalculator;
use App\Services\Calculations\GeneralAdvancementCalculator;
use App\Services\Calculations\ManagerReportCalculator;
use App\Services\Calculations\OSScoreConformityCalculator;
use App\Services\Calculations\PhysicalLayerGlobalConformityScoreCalculator;
use App\Services\Calculations\ProceduralLayerGlobalConformityScoreCalculator;
use App\Services\Calculations\SystemStatsCalculator;

class StatisticsService
{
    /**
     * @var CalculationServiceInterface[]
     */
    protected array $calculators;

    public function __construct()
    {
        $systemRepository = new SystemRepository();
       $missionRepository=new MissionRepository();
        $this->calculators = [
            'app_conf_score' => new AppScoreConformityCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'db_conf_score' => new DBScoreConformityCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'os_conf_score' => new OSScoreConformityCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'procedural_conf_score' => new ProceduralLayerGlobalConformityScoreCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'physical_conf_score' => new PhysicalLayerGlobalConformityScoreCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'global_adv' => new GeneralAdvancementCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'app_report' => new SystemStatsCalculator($systemRepository, new DefaultStatusWeightStrategy()),
            'missions_in_progress' => new AdminDashboardCalculator($missionRepository),
            'manager_mission_report' => new ManagerReportCalculator($missionRepository),

           
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

