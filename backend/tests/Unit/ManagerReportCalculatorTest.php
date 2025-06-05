<?php


namespace Tests\Unit;

use App\Repositories\V1\MissionRepository;
use Tests\TestCase;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Services\calculations\ManagerReportCalculator;
use PHPUnit\Framework\MockObject\MockObject;
class ManagerReportCalculatorTest extends TestCase
{
    private MissionRepository|MockObject $missionRepository;
 private ManagerReportCalculator $calculator;
 protected function setUp(): void
 {
     parent::setUp();

     $this->missionRepository = $this->createMock(MissionRepository::class);
     
     $this->calculator = new ManagerReportCalculator($this->missionRepository);
 }
 public function test_calculate(): void
 {
     $mockData = [[
         'mission' => 'Audit sécurité SI',
         'start_date' => '2024-01-01',
         'end_date' => '2024-02-28',
         'client' => 'ACME Corp',
         'nbr_control' => 6,
         'nbr_control_with_actions' => 6,
         'controls_effectifs' => 3,
         'controls_ineffectifs' => 3,
         'control_commence' => 6,
         'control_non_commence' => 0,
         'controls_finalises' => 3,
         'controls_non_finalises' => 3,
         'executions_not_applied' => 1,
         'executions_partially_applied' => 1,
         'executions_not_tested' => 1,
         'executions_not_applicable' => 0,
         'total_remediations' => 12,
         'total_finished_remediations' => 7,
         'total_ongoing_remediations' => 5,
         'repartition_par_execution' => json_encode([
             [
                 'execution_id' => 20,
                 'control_code' => 'CNT-001',
                 'total_remediations' => 2,
                 'finished_remediations' => 2,
                 'ongoing_remediations' => 0
             ]
         ])
     ]];
 
     $this->missionRepository
         ->method('getManagerMissionReport')
         ->with(1)
         ->willReturn($mockData);
 
     $result = $this->calculator->calculate(['mission_id' => 1]);
 
     $this->assertEquals('Audit sécurité SI', $result['mission_name']);
     $this->assertEquals(6, $result['nbrControl']);
     $this->assertEquals(50, $result['controlEffectif']);
     $this->assertEquals(50, $result['controlNonEffectif']);
     $this->assertEquals(100, $result['controlCommencé']);
     $this->assertEquals(0, $result['controlNonCommencé']);
     $this->assertEquals(3, $result['controlFinalisé']);
     $this->assertEquals(3, $result['controlNonFinalisé']);
     $this->assertEquals(1, count($result['executions'])); // 1 ligne d'exécution
     $this->assertEquals(100, $result['executions'][0]['remediations']['termine']);
     $this->assertEquals(0, $result['executions'][0]['remediations']['en_cours']);
 }
 

}
