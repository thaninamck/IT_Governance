<?php



namespace Tests\Unit;

use App\Repositories\V1\MissionRepository;
use Tests\TestCase;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Services\calculations\AdminDashboardCalculator;
use PHPUnit\Framework\MockObject\MockObject;

class AdminDashboardTest extends TestCase
{
    private MissionRepository|MockObject $missionRepository;
 private AdminDashboardCalculator $calculator;
 protected function setUp(): void
 {
     parent::setUp();

     $this->missionRepository = $this->createMock(MissionRepository::class);
     
     $this->calculator = new AdminDashboardCalculator($this->missionRepository);
 }
 public function test_calculate_returns_correct_format(): void
 {
     $fakeData = [
         (object)[
             'id' => 1,
             'mission' => 'Mission Intégrée',
             'client' => 'Air Algérie',
             'start_date' => '2024-01-01',
             'end_date' => '2024-06-01',
             'total_executions' => 10,
             'launched_executions' => 6,
             'not_launched_executions' => 4,
             'finalized_executions' => 3,
             'not_finalized_executions' => 3,
             'effective_controls' => 4,
             'noneffective_controls' => 6,
             'partially_applied_controls' => 2,
             'not_applied_controls' => 2,
             'not_tested_controls' => 1,
             'not_applicable_controls' => 1,
         ]
     ];

     $this->missionRepository
         ->method('getMissionsInprogress')
         ->willReturn($fakeData);

     $result = $this->calculator->calculate([]);

     $this->assertIsArray($result);
     $this->assertCount(1, $result);
     $this->assertEquals('Mission Intégrée', $result[0]['missionName']);
     $this->assertEquals(40, $result[0]['controlNonCommencé']); // 4/10 * 100
 }
}
