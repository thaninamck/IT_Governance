<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Log;

class ExecutionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->execution_id,
        'executionId' => $this->execution_id,
        'executionModification' => $this->execution_modification,
       // 'executionComment' => $this->execution_comment,
        'executionControlOwner' => $this->execution_control_owner,
        'executionLaunchedAt' => $this->execution_launched_at,
        'executionIpe' => $this->execution_ipe,
        'executionEffectiveness' => $this->execution_effectiveness,
        'executionDesign' => $this->execution_design,

        'statusId' => $this->status_id,
        'statusName' => $this->status_name,

        'missionId' => $this->mission_id,
        'missionName' => $this->mission_name,

        'controlId' => $this->control_id,
        'controlDescription' => $this->control_description,
        'controlCode' => $this->control_code,

        'riskId' => $this->risk_id,
        'riskName' => $this->risk_name,
        'riskCode' => $this->risk_code,
        'riskDescription' => $this->risk_description,
        'riskOwner' => $this->risk_owner,

        'coverageId' => $this->coverage_id,
        'coverageRiskId' => $this->coverage_risk_id,

        'layerId' => $this->layer_id,
        'layerName' => $this->layer_name,

        'systemId' => $this->system_id,
        'systemName' => $this->system_name,
        'systemOwner' => $this->system_owner_full_name,
        'systemOwnerEmail' => $this->system_owner_email,

        'majorProcess' => $this->major_process,
        'subProcess' => $this->sub_process,
        'typeName' => $this->type_name,

        'userId' => $this->user_id,
        'userFullName' => $this->tester_full_name,
'testScript' => $this->formatStepsText($this->steps),
        //'steps' => json_decode($this->steps ?? '[]', true),
        'sources' => json_decode($this->sources ?? '[]', true),
       // 'sources' => $this->formatSourcesText($this->sources),

    ];
}




    public function formatWorkplanOptions(array $data): array
{
    return [
        'applications' => $this->formatSystems($data['systems'] ?? []),
        'risks' => $this->formatRisks($data['risks'] ?? []),
        'controls' => $this->formatControls($data['controls'] ?? [])
    ];
}

protected function formatSystems(array $systems): array
{
    if (!isset($systems['systems'])) {
        return [];
    }

    return array_map(function ($system) {
        return [
            'id' => 'app' . $system['id'],
            'description' => $system['name'],
            'layers' => array_map(function ($layer) {
                return [
                    'id' => (string)$layer['id'],
                    'name' => $layer['name']
                ];
            }, $system['layers'] ?? []),
            'owner' => $system['ownerName'] ?? ''
        ];
    }, $systems['systems']);
}

protected function formatRisks($risks): array
{
    // Si c'est une collection, on utilise toArray(), sinon on utilise tel quel
    $risksArray = is_object($risks) && method_exists($risks, 'toArray') 
        ? $risks->toArray() 
        : $risks;

    return array_map(function ($risk) {
        return [
            'idRisk' => (string)$risk['id'],
            'description' => $risk['description'],
            'nom' => $risk['name'],
            'code' => $risk['code']
        ];
    }, $risksArray);
}

protected function formatControls($controls): array
{
    // Si c'est une collection, on utilise toArray(), sinon on utilise tel quel
    $controlsArray = is_object($controls) && method_exists($controls, 'toArray')
        ? $controls->toArray()
        : $controls;

    return array_map(function ($control) {
        return [
            'idCntrl' => (string)$control['id'],
            'description' => $control['description'],
            'majorProcess' => $control['major_process']['description'] ?? '',
            'subProcess' => $control['sub_process']['name'] ?? '',
            'type' => isset($control['type']['name']) ? strtolower($control['type']['name']) : '',
            'testScript' => $control['test_script'] ?? '',
            'code' => $control['code']
        ];
    }, $controlsArray);
}
private function formatStepsText($steps): string
{
   // Si steps est un JSON encodé en chaîne, on le décode
   $decoded = is_string($steps) ? json_decode($steps, true) : $steps;

   if (!is_array($decoded)) return '';

   return collect($decoded)
       ->pluck('step text')
       ->filter(fn($comment) => !is_null($comment) && trim($comment) !== '')
       ->map(fn($comment) => ucfirst(trim($comment)))
       ->implode('. ') . (count($decoded) ? '.' : '');
}
private function formatSourcesText($sources): ?string
{
    $decoded = is_string($sources) ? json_decode($sources, true) : $sources;

    if (!is_array($decoded)) return null;

    $uniqueNames = collect($decoded)
        ->pluck('source_name')
        ->filter(fn($name) => !is_null($name) && trim($name) !== '')
        ->unique()
        ->values();

    return $uniqueNames->isNotEmpty() ? $uniqueNames->implode(', ') : null;
}


public static function structuredResponse($executions)
{
    return $executions->map(function ($execution) {
        return [
            'id'=>$execution->id,
            'executionId' => $execution->id,
            'executionModification' => $execution->cntrl_modification,
            'executionEffectiveness' => $execution->effectiveness,
            'executionDesign' => $execution->design,
            'executionLaunchedAt' => $execution->launched_at,
            'executionIpe' => $execution->ipe,
            'executionControlOwner' => $execution->control_owner,
            'executionStatus' => $execution->status->status_name ?? null,
            'executionStatusId' => $execution->status_id ?? null,

            // Infos de l’utilisateur
            'testerId' => optional($execution->user)->id,
           'testerName' => optional($execution->user)->first_name . ' ' . optional($execution->user)->last_name,
            'testerEmail' => optional($execution->user)->email,
           // 'testerProfile' => optional(optional($execution->user->participations)->profile)->profile_name,

            // Infos du système
            'systemId' => optional($execution->layer->system)->id,
            'systemName' => optional($execution->layer->system)->name,
            'systemOwner' => optional($execution->layer->system->owner)->full_name,
            'systemOwnerEmail' => optional($execution->layer->system->owner)->email,

            // Infos du layer
            'layerId' => optional($execution->layer)->id,
            'layerName' => optional($execution->layer)->name,

            // Infos de la mission
            'missionId' => optional($execution->layer->system->mission)->id,
            'missionName' => optional($execution->layer->system->mission)->mission_name,

            // Infos du contrôle
            'controlCode' => $execution->steps->first()?->control->code,
            

            // Infos du risque
            'riskId' => $execution->coverage->first()->risk_id,
            // 'riskName' => $execution->coverage->first()->risk_name,
            // 'riskCode' => $execution->coverage->first()->risk_code,
            // 'riskDescription' => $execution->coverage->first()->risk_modification,
            // 'riskOwner' => $execution->coverage->first()->risk_owner,

            // Autres
            // 'typeName' => $execution->type_name,
             'majorProcess' =>$execution->steps->first()?->control->majorProcess->description,
             'subProcess' =>$execution->steps->first()?->control->subProcess->name,
            // 'sources' => json_decode($execution->sources ?? '[]', true),
           
        ];
    });
}


}
