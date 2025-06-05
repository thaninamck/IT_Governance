<?php

namespace Tests\Unit;

use App\Models\Mission;
use App\Models\Status;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\StatusRepository;
use App\Services\NotificationService;
use App\Services\V1\MissionService;
use App\Services\V1\ParticipationService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class MissionServiceTest extends TestCase
{
    /** @var MissionRepository&MockObject */
    private $missionRepository;

    /** @var StatusRepository&MockObject */
    private $statusRepository;

    /** @var ParticipationService&MockObject */
    private $participationService;

    /** @var NotificationService&MockObject */
    private $notificationService;

    private MissionService $missionService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->missionRepository = $this->createMock(MissionRepository::class);
        $this->participationService = $this->createMock(ParticipationService::class);
        $this->statusRepository = $this->createMock(StatusRepository::class);
        $this->notificationService = $this->createMock(NotificationService::class);

        $this->missionService = new MissionService(
            $this->missionRepository,
            $this->participationService,
            $this->statusRepository,
            $this->notificationService
        );
    }

    public function testCreateMissionWithValidDataReturnsMission(): void
    {
        $data = [
            'mission_name' => 'Audit Sécurité 2025',
            'client_id' => 1,
            'manager_id' => 2,
            'audit_start_date' => '2025-01-01',
            'audit_end_date' => '2025-01-15',
            'start_date' => '2025-01-16',
            'end_date' => '2025-02-01',
        ];

        $mockStatus = new Status(['status_name' => Status::STATUS_NON_COMMENCEE]);
        $mockStatus->id = 7;

        $this->statusRepository->expects($this->once())
            ->method('getMissionStatusByName')
            ->with(Status::STATUS_NON_COMMENCEE)
            ->willReturn($mockStatus);

        $expectedData = $data;
        $expectedData['status_id'] = 7;
        $mockMission = new Mission($expectedData);

        $this->missionRepository->expects($this->once())
            ->method('createMission')
            ->with($this->callback(function ($passedData) use ($expectedData) {
                $this->assertEquals($expectedData, $passedData);
                return true;
            }))
            ->willReturn($mockMission);


        $result = $this->missionService->createMission($data);

        $this->assertInstanceOf(Mission::class, $result);
        $this->assertEquals('Audit Sécurité 2025', $result->mission_name);
        $this->assertEquals(7, $result->status_id);
    }


    public function testCreateMissionWithMissingStatusThrowsException(): void
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Statut 'non_commencee' pour les missions introuvable.");

        $this->statusRepository->expects($this->once())
            ->method('getMissionStatusByName')
            ->willReturn(null);

        $this->missionService->createMission([
            'mission_name' => 'Mission Invalide',
            'client_id' => 1,
            'manager_id' => 2,
            'audit_start_date' => '2025-01-01',
            'audit_end_date' => '2025-01-15',
            'start_date' => '2025-01-16',
            'end_date' => '2025-02-01',
        ]);
    }
}
