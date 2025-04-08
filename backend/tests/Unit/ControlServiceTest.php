<?php

namespace Tests\Unit;

use App\Repositories\V1\StepTestScriptRepository;
use PHPUnit\Framework\TestCase;
use App\Services\V1\ControlService;
use App\Repositories\V1\ControlRepository;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SubProcessRepository;
use App\Repositories\V1\TypeRepository;
use App\Repositories\V1\SourceRepository;
use App\Models\Control;
use PHPUnit\Framework\MockObject\MockObject;

class ControlServiceTest extends TestCase
{
    /** @var ControlRepository&MockObject */
    private $controlRepository;
    
    /** @var MajorProcessRepository&MockObject */
    private $majorProcessRepository;
    
    /** @var SubProcessRepository&MockObject */
    private $subProcessRepository;
    
    /** @var TypeRepository&MockObject */
    private $typeRepository;
    
    /** @var SourceRepository&MockObject */
    private $sourceRepository;
    
    /** @var StepTestScriptRepository&MockObject */
    private $stepTestScriptRepository;

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

    /**
     * Teste la création d'un contrôle avec des données valides
     */
    public function testCreateControlWithValidDataReturnsControl(): void
    {
        // 1. Arrange - Préparation des données
        $data = [
            'code' => 'C001',
            'test_script' => '1. First step\n2. Second step',
            'description' => 'Test Control',
            'type' => ['id'=>1, 'name' => 'Type1'],
            'majorProcess' => ['code' => 'MP001', 'description' => 'Major Process'],
            'subProcess' => ['id'=>1,'code' => 'SP001', 'name' => 'Sub Process'],
            'sources' => [['id'=>1,'name' => 'Source1'], ['id'=>1,'name' => 'Source2']],
        ];

        // 2. Mock - Configuration des comportements attendus
        $this->typeRepository->expects($this->once())
            ->method('firstOrCreate')
            ->with(['name' => 'Type1'])
            ->willReturn((object)['id' => 1]);

            $this->majorProcessRepository->expects($this->once())
            ->method('firstOrCreate')
            ->with([
                'code' => $data['majorProcess']['code'],
                'description' => $data['majorProcess']['description']
            ])
            ->willReturn((object)[
                'id' => 1,
                'code' => 'MP001',
                'description' => 'Major Process'
            ]);

        $this->subProcessRepository->expects($this->once())
            ->method('firstOrCreate')
            ->with([
                'code' => $data['subProcess']['code'],
                'name' => $data['subProcess']['name']
                
            ])
            ->willReturn((object)
            ['id' => 1,
                'code' => 'SP001',
                'name' => 'Sub Process'
            ]);

            $this->sourceRepository->expects($this->exactly(2))
            ->method('firstOrCreate')
            ->with($this->logicalOr(
                $this->equalTo(['name' => $data['sources'][0]['name']]),
                $this->equalTo(['name' => $data['sources'][1]['name']])
            ))
            ->willReturnOnConsecutiveCalls(
                (object)['id' => 1],
                (object)['id' => 2]
            );
        
            
            $controlData = [
                'code' => $data['code'],
                'test_script' => $data['test_script'] ?? null,
                'description' => $data['description'] ?? null,
                'is_archived' => $data['is_archived'] ?? false,
                'type_id' => 1,
                'major_id' =>1,
                'sub_id' =>1,
                
            ];
            $controlMock = new Control([
                'id' => 1, // Cet ID est crucial
                'code' => 'C001',
                'description' => 'Test Control',
                'type_id' => 1,
                'major_id' => 1,
                'sub_id' => 1
            ]);
        // Mock StepTestScriptRepository
        $this->stepTestScriptRepository->expects($this->exactly(2))
        ->method('create')
        ->willReturnCallback(function ($arg) use ($controlMock) {
            static $callCount = 0;
            $callCount++;
            
            // Vérifie que le control_id est bien celui du contrôle créé
            $this->assertEquals($controlMock->id, $arg['control_id']);
            
            if ($callCount === 1) {
                $this->assertEquals(trim(' First step\n'), trim($arg['text']));
                return (object)[
                    'id' => 1, 
                    'text' => 'First step', 
                    'control_id' => $controlMock->id
                ];
            }
            
            $this->assertEquals(trim('Second step'), trim($arg['text']));
            return (object)[
                'id' => 2, 
                'text' => 'Second step', 
                'control_id' => $controlMock->id
            ];
        });
        $this->controlRepository->expects($this->once())
            ->method('createControl')
            ->with($controlData)
            ->willReturn(new Control([
                'id' => 1,
                'code' => 'C001',
                'description' => 'Test Control'
            ]));

        // 3. Act - Exécution de la méthode
        $result = $this->controlService->createControl($data);

        // 4. Assert - Vérifications
        $this->assertInstanceOf(Control::class, $result);
        $this->assertEquals('C001', $result->code);
        $this->assertEquals('Test Control', $result->description);
    }

    /**
     * Teste la création d'un contrôle avec des données incomplètes
     */
    public function testCreateControlWithMissingDataThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        
        $this->controlService->createControl([
            'code' => 'C001', 
            // Données manquantes
        ]);
    }
}