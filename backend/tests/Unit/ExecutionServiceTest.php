<?php

namespace Tests\Unit;
use App\Repositories\V1\CntrlRiskCovRepository;
use App\Repositories\V1\CommentRepository;
use App\Repositories\V1\ExecutionRepository;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\StatusRepository;
use App\Repositories\V1\StepTestScriptRepository;
use App\Services\NotificationService;
use App\Services\V1\EvidenceService;
use App\Services\V1\ExecutionService;
use PHPUnit\Framework\MockObject\MockObject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ExecutionServiceTest extends TestCase
{
    private ExecutionRepository|MockObject $executionRepository;
    private NotificationService|MockObject $notificationService;
    private EvidenceService|MockObject $evidenceService;

    private CntrlRiskCovRepository|MockObject $covRepository;
    private MissionRepository|MockObject $missionRepository;
    private StatusRepository|MockObject $statusRepository;
    private StepTestScriptRepository|MockObject $stepRepository;
    private CommentRepository|MockObject $commentRepository;

    private ExecutionService $service;
    protected function setUp(): void
    {
        parent::setUp();
    
        $this->commentRepository = $this->createMock(CommentRepository::class);
        $this->evidenceService = $this->createMock(EvidenceService::class);
        $this->notificationService = $this->createMock(NotificationService::class);
        $this->executionRepository = $this->createMock(ExecutionRepository::class);
        $this->covRepository = $this->createMock(CntrlRiskCovRepository::class);
        $this->statusRepository = $this->createMock(StatusRepository::class);
        $this->stepRepository = $this->createMock(StepTestScriptRepository::class);
        $this->missionRepository = $this->createMock(MissionRepository::class);
    
        $this->service = new ExecutionService(
            $this->commentRepository,
            $this->evidenceService,
            $this->notificationService,
            $this->executionRepository,
            $this->covRepository,
            $this->statusRepository,
            $this->stepRepository,
            $this->missionRepository
        );
    }
    
    public function test_create_execution(): void
{
    $executionData = [
        'controlModified' => true,
        'controlDescription' => 'Contrôle ABC',
        'controlId' => 1,
        'controlTester' => 2,
        'controlOwner' => 3,
        'layerId' => 4,
        'riskModified' => true,
        'riskDescription' => 'Risque XYZ',
        'riskId' => 5,
        'riskOwner' => 6,
    ];

    $data = [
        'executions' => [$executionData],
    ];

    // Création d'une instance réelle du modèle Execution
    $fakeExecution = new \App\Models\Execution();
    $fakeExecution->id = 123;

    // Mock du système retourné par getsystemIdByExecutionIdAndMissionIdAndLayerId
    $systemMock = new \stdClass();
    $systemMock->system_id = 1;
    $systemMock->mission_id = 2;
    $systemMock->mission_name = 'Mission Test';

    // Expectation pour createExecution
    $this->executionRepository
        ->expects($this->once())
        ->method('createExecution')
        ->with($this->callback(function ($input) use ($executionData) {
            return $input['controlDescription'] === $executionData['controlDescription'] &&
                   $input['controlId'] === $executionData['controlId'];
        }))
        ->willReturn($fakeExecution);

    // Expectation pour getsystemIdByExecutionIdAndMissionIdAndLayerId
    $this->executionRepository
        ->expects($this->once())
        ->method('getsystemIdByExecutionIdAndMissionIdAndLayerId')
        ->with($executionData['layerId'], $fakeExecution->id)
        ->willReturn($systemMock);

    // Expectation pour sendNotification
    $this->notificationService
        ->expects($this->once())
        ->method('sendNotification')
        ->with(
            $executionData['controlTester'],
            $this->stringContains('Mission Test'),
            $this->arrayHasKey('type'),
            'affectation_cntrl'
        );

    // Expectation pour createCoverage
    $this->covRepository
        ->expects($this->once())
        ->method('createCoverage')
        ->with($this->callback(function ($coverageInput) use ($executionData, $fakeExecution) {
            return $coverageInput['riskId'] === $executionData['riskId'] &&
                   $coverageInput['execution_id'] === $fakeExecution->id &&
                   $coverageInput['riskOwner'] === $executionData['riskOwner'];
        }));

    $result = $this->service->createExecutions($data);

    $this->assertSame($fakeExecution, $result);
}


public function test_create_execution_with_unmodified_descriptions(): void
{
    $executionData = [
        'controlModified' => false,
        'controlDescription' => 'Doit être ignoré',
        'controlId' => 1,
        'controlTester' => 2,
        'controlOwner' => 3,
        'layerId' => 4,
        'riskModified' => false,
        'riskDescription' => 'Doit être ignoré',
        'riskId' => 5,
        'riskOwner' => 6,
    ];

    $data = ['executions' => [$executionData]];

    $fakeExecution = new \App\Models\Execution();
    $fakeExecution->id = 123;

    $systemMock = new \stdClass();
    $systemMock->system_id = 1;
    $systemMock->mission_id = 2;
    $systemMock->mission_name = 'Mission Test';

    $this->executionRepository
        ->expects($this->once())
        ->method('createExecution')
        ->with($this->callback(function ($input) {
            return $input['controlDescription'] === null;
        }))
        ->willReturn($fakeExecution);

    $this->executionRepository
        ->expects($this->once())
        ->method('getsystemIdByExecutionIdAndMissionIdAndLayerId')
        ->willReturn($systemMock);

    $this->notificationService
        ->expects($this->once())
        ->method('sendNotification');

    $this->covRepository
        ->expects($this->once())
        ->method('createCoverage')
        ->with($this->callback(function ($input) {
            return $input['riskDescription'] === null;
        }));

    $result = $this->service->createExecutions($data);
    $this->assertSame($fakeExecution, $result);
}


public function test_create_execution_without_control_tester(): void
{
    $executionData = [
        'controlModified' => true,
        'controlDescription' => 'Contrôle ABC',
        'controlId' => 1,
        'controlTester' => null, 
        'controlOwner' => 3,
        'layerId' => 4,
        'riskModified' => true,
        'riskDescription' => 'Risque XYZ',
        'riskId' => 5,
        'riskOwner' => 6,
    ];

    $data = ['executions' => [$executionData]];

    $fakeExecution = new \App\Models\Execution();
    $fakeExecution->id = 123;

    $this->executionRepository
        ->expects($this->once())
        ->method('createExecution')
        ->willReturn($fakeExecution);

    // Ne doit pas être appelée
    $this->executionRepository
        ->expects($this->never())
        ->method('getsystemIdByExecutionIdAndMissionIdAndLayerId');

    $this->notificationService
        ->expects($this->never())
        ->method('sendNotification');

    $this->covRepository
        ->expects($this->once())
        ->method('createCoverage');

    $result = $this->service->createExecutions($data);
    $this->assertSame($fakeExecution, $result);
}

    
}
