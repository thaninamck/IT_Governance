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
            'executionId' => $this->execution_id,
            'executionModification' => $this->execution_modification,
            'executionRemark' => $this->execution_remark,
            'executionControlOwner' => $this->execution_control_owner,
            'executionLaunchedAt' => $this->execution_launched_at,
            'executionIpe' => $this->execution_ipe,
            'executionEffectiveness' => $this->execution_effectiveness,
            'executionDesign' => $this->execution_design,
            'statusName' => $this->status_name,
            'statusId' => $this->status_id,
            'missionId' => $this->mission_id,
            'missionName' => $this->mission_name,
            'controlId' => $this->control_id,
            'controlDescription' => $this->control_description,
            'controlCode' => $this->control_code,
           
            'coverageId' => $this->coverage_id,
            'coverageRiskId' => $this->coverage_risk_id,
            'riskId' => $this->risk_id,
            'riskName' => $this->risk_name,
            'riskCode' => $this->risk_code,
            'riskDescription' => $this->risk_description,
            'riskOwner'=>$this->risk_owner,
            'layerId' => $this->layer_id,
            'layerName' => $this->layer_name,
            'systemId' => $this->system_id,
            'systemName' => $this->system_name,
            'systemOwner' => $this->system_owner_full_name,
            'systemOwnerEmail' => $this->system_owner_email,

            'userId' => $this->user_id,
            'userFullName' => $this->tester_full_name,
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

}
