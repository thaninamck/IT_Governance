<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RemediationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ownerContact' => $this->owner_cntct,
            'description' => $this->description,
            'suivi' => $this->follow_up,
            'executionId' => $this->execution_id,
            'remediation_evidences' => $this->remediationEvidence->map(function ($evidence) {
    return [
        'id' => $evidence->id,
        'file_name' => $evidence->file_name,
    ];
}),
    
            // Champs de la table Execution
            // 'execution' => [
            //     'control_owner' => $this->execution->control_owner ?? null,
            //     'remark' => $this->execution->remark ?? null,
            //     'ipe' => $this->execution->ipe ?? null,
            //     'design' => $this->execution->design ?? null,
            //     'effectiveness' => $this->execution->effectiveness ?? null,
            //     'launched_at' => $this->execution->launched_at ?? null,
    
            //     // Infos de l’utilisateur lié
            //     'user' => [
            //         'id' => $this->execution->user->id ?? null,
            //         'name' => $this->execution->user->name ?? null,
            //         'email' => $this->execution->user->email ?? null,
            //     ],
    
            //     // Infos du layer
            //     'layer' => [
            //         'id' => $this->execution->layer->id ?? null,
            //         'name' => $this->execution->layer->name ?? null,
            //     ],
            // ]
        ];
    }
}
