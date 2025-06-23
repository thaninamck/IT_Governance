<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\V1\ControlService;
use App\Repositories\V1\TypeRepository;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SubProcessRepository;
use App\Repositories\V1\SourceRepository;
use App\Repositories\V1\StepTestScriptRepository;
use App\Repositories\V1\ControlRepository;
use Illuminate\Support\Facades\Log;
use App\Models\Control;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use PHPUnit\Framework\MockObject\MockObject;

class ControlServiceTest extends TestCase
{
    private ControlRepository|MockObject $controlRepository;
    private MajorProcessRepository|MockObject $majorProcessRepository;
    private SubProcessRepository|MockObject $subProcessRepository;
    private TypeRepository|MockObject $typeRepository;
    private SourceRepository|MockObject $sourceRepository;
    private StepTestScriptRepository|MockObject $stepTestScriptRepository;

    private ControlService $controlService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->controlRepository = $this->createMock(ControlRepository::class);
        $this->majorProcessRepository = $this->createMock(MajorProcessRepository::class);
        $this->subProcessRepository = $this->createMock(SubProcessRepository::class);
        $this->typeRepository = $this->createMock(TypeRepository::class);
        $this->sourceRepository = $this->createMock(SourceRepository::class);
        $this->stepTestScriptRepository = $this->createMock(StepTestScriptRepository::class);

        $this->controlService = new ControlService(
            $this->stepTestScriptRepository,
            $this->controlRepository,
            $this->majorProcessRepository,
            $this->subProcessRepository,
            $this->typeRepository,
            $this->sourceRepository
        );
    }

    public function testCreateControlWithType(): void
    {
        $data = [
            'code' => 'C001',
            'test_script' => "1. First step\n2. Second step",
            'description' => 'Test Control',
            'type' => ['id' => 1, 'name' => 'Type1'],
            'majorProcess' => ['code' => 'MP001', 'description' => 'Major Process'],
            'subProcess' => ['id' => 1, 'code' => 'SP001', 'name' => 'Sub Process'],
            'sources' => [
                ['id' => 1, 'name' => 'Source1'],
                ['id' => 2, 'name' => 'Source2'],
            ],
        ];

        $typeMock = (object)['id' => 1, 'name' => 'Type1'];
        $majorMock = (object)['id' => 1, 'code' => 'MP001', 'description' => 'Major Process'];
        $subMock = (object)['id' => 1, 'code' => 'SP001', 'name' => 'Sub Process'];

        $this->typeRepository->method('firstOrCreate')->willReturn($typeMock);
        $this->majorProcessRepository->method('firstOrCreate')->willReturn($majorMock);
        $this->subProcessRepository->method('firstOrCreate')->willReturn($subMock);

        $this->sourceRepository->method('firstOrCreate')->willReturnCallback(function ($data) {
            return (object)[
                'id' => $data['name'] === 'Source1' ? 1 : 2,
                'name' => $data['name']
            ];
        });

        $this->stepTestScriptRepository
        ->expects($this->exactly(2))
        ->method('create')
        ->willReturnCallback(function ($step) {
            $expectedSteps = ['First step', 'Second step'];
            static $index = 0;
    
            $text = trim($step['text']); // Supprime les espaces en trop
            TestCase::assertEquals($expectedSteps[$index], $text);
            TestCase::assertEquals(1, $step['control_id']);
            $index++;
        });
    


        // Mock de la relation sources()->sync()
        $mockRelation = $this->getMockBuilder(BelongsToMany::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['sync'])
            ->getMock();

        $mockRelation->expects($this->once())->method('sync')->with([]);

        // Mock final du modèle Control
        $controlMock = $this->getMockBuilder(Control::class)
            ->onlyMethods(['load', 'sources'])
            ->getMock();

        $controlMock->id = 1;
        $controlMock->type_id = 1;
        $controlMock->major_id = 1;
        $controlMock->sub_id = 1;
        $controlMock->code = 'C001';
        $controlMock->description = 'Test Control';

        $controlMock->method('load')->willReturnSelf();
        $controlMock->method('sources')->willReturn($mockRelation);

        $this->controlRepository
            ->method('createControl')
            ->willReturn($controlMock);

        $result = $this->controlService->createControl($data);

        Log::info('Résultat du control créé :', [
            'id' => $result->id,
            'code' => $result->code,
            'description' => $result->description,
            'type_id' => $result->type_id,
            'major_id' => $result->major_id,
            'sub_id' => $result->sub_id,
        ]);

        $this->assertInstanceOf(Control::class, $result);
        $this->assertEquals('C001', $result->code);
        $this->assertEquals(1, $result->type_id);
    }




    public function testCreateControlWithoutTestScript(): void
    {
        $data = [
            'code' => 'C002',
            'description' => 'Control without test script',
            'type' => ['id' => 2, 'name' => 'Type2'],
            'majorProcess' => ['code' => 'MP002', 'description' => 'Major Process 2'],
            'subProcess' => ['id' => 2, 'code' => 'SP002', 'name' => 'Sub Process 2'],
            'sources' => [],
        ];
    
        $typeMock = (object)['id' => 2, 'name' => 'Type2'];
        $majorMock = (object)['id' => 2, 'code' => 'MP002', 'description' => 'Major Process 2'];
        $subMock = (object)['id' => 2, 'code' => 'SP002', 'name' => 'Sub Process 2'];
    
        $this->typeRepository->method('firstOrCreate')->willReturn($typeMock);
        $this->majorProcessRepository->method('firstOrCreate')->willReturn($majorMock);
        $this->subProcessRepository->method('firstOrCreate')->willReturn($subMock);
    
        $this->sourceRepository->method('firstOrCreate')->willReturnCallback(function ($data) {
            return (object)[
                'id' => $data['name'] === 'Source1' ? 1 : 2,
                'name' => $data['name']
            ];
        });
    
        // Mock de la relation sources()->sync()
        $mockRelation = $this->getMockBuilder(BelongsToMany::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['sync'])
            ->getMock();
    
        $mockRelation->expects($this->once())->method('sync')->with([]);
    
        // Mock du modèle Control
        $controlMock = $this->getMockBuilder(Control::class)
            ->onlyMethods(['load', 'sources'])
            ->getMock();
    
        $controlMock->id = 2;
        $controlMock->type_id = 2;
        $controlMock->major_id = 2;
        $controlMock->sub_id = 2;
        $controlMock->code = 'C002';
        $controlMock->description = 'Control without test script';
    
        $controlMock->method('load')->willReturnSelf();
        $controlMock->method('sources')->willReturn($mockRelation);
    
        $this->controlRepository
            ->method('createControl')
            ->willReturn($controlMock);
    
        $result = $this->controlService->createControl($data);
    
        // Log::info('Résultat du control créé :', [
        //     'id' => $result->id,
        //     'code' => $result->code,
        //     'description' => $result->description,
        //     'type_id' => $result->type_id,
        //     'major_id' => $result->major_id,
        //     'sub_id' => $result->sub_id,
        // ]);
    
        $this->assertInstanceOf(Control::class, $result);
        $this->assertEquals('C002', $result->code);
        $this->assertEquals(2, $result->type_id);
        $this->stepTestScriptRepository->expects($this->never())->method('create');
    }
    public function testCreateControlWithRepositoryException(): void
    {
        $this->expectException(\Exception::class);
    
        $this->controlRepository->method('createControl')
            ->willThrowException(new \Exception('Repository Error'));
    
        $data = [
            'code' => 'C005',
            'test_script' => "1. First step\n2. Second step",
            'description' => 'Control with repo exception',
            'type' => ['id' => 5, 'name' => 'Type5'],
            'majorProcess' => ['code' => 'MP005', 'description' => 'Major Process 5'],
            'subProcess' => ['id' => 5, 'code' => 'SP005', 'name' => 'Sub Process 5'],
            'sources' => [
                ['id' => 1, 'name' => 'Source1'],
            ],
        ];
    
        $this->controlService->createControl($data); // Doit lever une exception
    }
        


   

}
