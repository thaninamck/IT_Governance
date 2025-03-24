<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'layerId' => $this->layer_id,
            'layerName' => $this->layer_name,
            'systemId' => $this->system_id,
            'systemName' => $this->system_name,
            'systemOwner' => $this->system_owner_full_name,
            'systemOwnerEmail' => $this->system_owner_email,

            'userId' => $this->user_id,
            'userFullName' => $this->user_full_name,
        ];
    }
}
