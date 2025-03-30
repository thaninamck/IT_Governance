<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\Source;
use App\Models\StepTestScript;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SourceRepository;
use App\Repositories\V1\StepTestScriptRepository;
use App\Repositories\V1\SubProcessRepository;
use App\Repositories\V1\TypeRepository;
use Log;
use Illuminate\Support\Facades\DB;

class ControlService
{
    protected $controlRepository;
    protected $majorProcessRepository;
    protected $subProcessRepository;
    protected $sourceRepository;
    protected $typeRepository;
    protected $stepTestScriptRepository;
    public function __construct(StepTestScriptRepository $stepTestScriptRepository,ControlRepository $controlRepository,MajorProcessRepository $majorprocessRepository,SubProcessRepository $subProcessRepository,TypeRepository $typeRepository,SourceRepository $sourceRepository)
    {
        $this->controlRepository = $controlRepository;
        $this->majorProcessRepository=$majorprocessRepository;
        $this->subProcessRepository=$subProcessRepository;
        $this->typeRepository=$typeRepository;
        $this->sourceRepository=$sourceRepository;
        $this->stepTestScriptRepository = $stepTestScriptRepository;

    }

    public function getSelectOptions()
    {
        $types = $this->typeRepository->getAllTypes();
        $majorProcesses = $this->majorProcessRepository->getAllMajorProcesses();
        $subProcesses = $this->subProcessRepository->getAllSubProcesses();
        $sources = $this->sourceRepository->getAllSources();

        return [
            'types' => $types,
            'majorProcesses' => $majorProcesses,
            'subProcesses' => $subProcesses,
            'sources' => $sources,
        ];
    }
    public function getAllControls()
{
    $controls = $this->controlRepository->getAllControls();

    $controls->each(function ($control) {
        $stepTexts = $control->steps->pluck('text')->toArray();
        $formattedSteps = $this->joinSteps($stepTexts);
        $control->setAttribute('test_script', $formattedSteps); 
    });

    Log::debug('Controls', $controls->toArray());

    return $controls;
}


    public function getControlById(int $id)
    {
        return $this->controlRepository->getControlById($id);
    }

    
    public function updateControl($id, array $data)
{
    $control = $this->controlRepository->getControlById($id);

    if (!$control) {
        return null; 
    }
    $control->code = $data['code'] ?? $control->code;

    $control->description = $data['description'] ?? $control->description;
    $steps = $this->splitSteps($data['testScript']);
    $control->steps()->delete();
    
    foreach ($steps as $step) {
        $step=[
            'text' => $step,
            'control_id' => $control->id
        ];
        $this->stepTestScriptRepository->create($step);
        
    }

    if (isset($data['type'][0])) {
        $control->type_id = $data['type'][0];
    }

    if ($control->majorProcess) {
        $this->majorProcessRepository->update($control->majorProcess, [
            'designation' => $data['majorProcess'] ?? null,
            'code' => $data['majorProcessCode'] ?? null,
        ]);
    }

    if (isset($data['subProcessCode'])) {
        $subProcess = $this->subProcessRepository->findById($control->sub_id); // 🔥 Correction ici

        if ($subProcess) {
            $this->subProcessRepository->update($subProcess, [
                'name' => $data['subProcess'] ?? null,
                'code' => $data['subProcessCode'] ?? null,
            ]);
        }
    }

    if (isset($data['sources']) && is_array($data['sources'])) {
        $sourceIds = collect($data['sources'])->pluck(0)->toArray();
        $control->sources()->sync($sourceIds);
    }

    $control->save();

    return $control->load(['type', 'majorProcess', 'subProcess', 'sources','steps']);
}

    
    
    
public function createControl(array $data)
{
    $type = $this->typeRepository->firstOrCreate([
        //'id' => $data['type']['id'] ?? null,
        'name' => $data['type']['name'] ?? 'Type inconnu'
    ]);

    $majorProcess = $this->majorProcessRepository->firstOrCreate([
        //'id' => $data['majorProcess']['id'] ?? null,
        'code' => $data['majorProcess']['code'] ?? 'code inconnu',
        'description' => $data['majorProcess']['description'] ?? 'Description inconnue'
    ]);

    
if (!empty($data['subProcess']) && is_array($data['subProcess'])) {
    Log::debug('subProcess', $data['subProcess']);
    $subProcess = $this->subProcessRepository->firstOrCreate([
        
        'code' => $data['subProcess']['code'] ?? 'code inconnu',
        'name' => $data['subProcess']['name'] ?? 'Nom inconnu'
    ]);
    
}
Log::debug('Avant assignation', ['sub_id' => $subProcess->id]);

$controlData = [
    'code' => $data['code'],
    'test_script' => $data['test_script'] ?? null,
    'description' => $data['description'] ?? null,
    'is_archived' => $data['is_archived'] ?? false,
    'type_id' => $type->id,
    'major_id' => $majorProcess->id,
    'sub_id' => $subProcess->id, 
];

//Log::debug('Données avant insertion', $data);


// Création du contrôle
$control = $this->controlRepository->createControl($controlData);

if (!empty($data['test_script'])) {
    $steps = $this->splitSteps($data['test_script']);

    // Insérer chaque étape dans la table step_test_scripts
    foreach ($steps as $step) {
        $step=[
            'text' => $step,
            'control_id' => $control->id
        ];
        $this->stepTestScriptRepository->create($step);
        
    }}

    Log::debug('sources', $data['sources']);

    
    if (isset($data['sources']) ) {
        Log::debug('sources', context: $data['sources']);

        $sourceIds = [];
        foreach ($data['sources'] as $sourceData) {
            $source = $this->sourceRepository->firstOrCreate([
               // 'id' => $sourceData['id'] ?? null,
                'name' => $sourceData['name'] ?? 'Source inconnue'
            ]);
            $sourceIds[] = $source->id;
        }
        $sourceIds = array_filter($sourceIds, function ($id) {
            return Source::where('id', $id)->exists();
        });
        Log::debug('sourcesids', context: $sourceIds);

        $control->sources()->sync($sourceIds);
        
    }

    return $control->load(['type', 'majorProcess', 'subProcess', 'sources']);
}


private function splitSteps(string $text): array
{
    return preg_split('/\d+\./', $text, -1, PREG_SPLIT_NO_EMPTY);
}

private function joinSteps(array $steps): string
{
    $result = '';
    foreach ($steps as $index => $step) {
        $result .= ($index + 1) . '. ' . trim($step) . "\n";
    }
    return trim($result);
}


public function archiveControl($id)
{
    return $this->controlRepository->archive($id);
}
public function restoreControl($id)
{
    return $this->controlRepository->restore($id);
}

public function deleteControl($id){
    $control=$this->controlRepository->getControlById($id);
    //Log::debug("controle", context: [$control]);
    if (!($this->controlRepository->hasRelatedData($control))) {
       return  $this->controlRepository->deleteControl($control);
    }
}


public function deleteMultipleControls(array $ids): int
{
    $deletedCount = 0;

    foreach ($ids as $id) {
        $deleted = $this->deleteControl($id);
        if ($deleted !== null) { 
            $deletedCount++;
        }
    }

    return $deletedCount; 
}


}

