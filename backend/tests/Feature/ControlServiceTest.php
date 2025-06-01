<?php



namespace Tests\Feature;
use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\Source;
use App\Models\StepTestScript;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SourceRepository;
use App\Repositories\V1\StepTestScriptRepository;
use App\Repositories\V1\SubProcessRepository;
use App\Repositories\V1\TypeRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Type;
use App\Models\MajorProcess;
use App\Models\SubProcess;

use App\Services\V1\ControlService;


class ControlServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_control_with_all_relations(): void
    {
        $service = new ControlService(
            new StepTestScriptRepository,
            new ControlRepository,
            new MajorProcessRepository,
            new SubProcessRepository,
            new TypeRepository,
            new SourceRepository
        );

        $data = [
            'code' => 'CTRL-001',
            'test_script' => "Step one\nStep two",
            'description' => 'Control de test',
            'type' => ['name' => 'Sécurité'],
            'majorProcess' => ['code' => 'MP001', 'description' => 'Processus majeur'],
            'subProcess' => ['code' => 'SP001', 'name' => 'Sous-processus'],
            'sources' => [
                ['name' => 'Source A'],
                ['name' => 'Source B'],
            ],
        ];

       
        $control = $service->createControl($data);

       
        $this->assertDatabaseHas('controls', [
            'code' => 'CTRL-001',
            'description' => 'Control de test',
        ]);

        $this->assertEquals(2, $control->sources()->count());
        $this->assertEquals(1, $control->steps()->count());

        $this->assertEquals('Sécurité', $control->type->name);
        $this->assertEquals('MP001', $control->majorProcess->code);
        $this->assertEquals('SP001', $control->subProcess->code);
    }
}

