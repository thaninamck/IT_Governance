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
            'startDate'=>$this->start_date,
            'endDate'=>$this->end_date,
            'statusId'=>$this->status_id,
            'actionName'=>$this->action_name,
            'executionId' => $this->execution_id,
      'statusName' => $this->status ? $this->status->status_name : 'Non Commencée',
        'entity'=>$this->status ? $this->entity :'Inconnu',
        'control_owner' => $this->execution->control_owner ?? null,
    'controlCode' => optional($this->execution->steps->first()?->control)->code,
        'risk_owner' => optional($this->execution->coverage->first())->risk_owner,
      'missionName' => $this->execution->layer->system->mission->mission_name ?? null,
        'SystemName' => $this->execution->layer->system->name,
'ownerSystem' => optional($this->execution->layer->system->owner)->full_name,
'ownerSystem_email' => optional($this->execution->layer->system->owner)->email,
'layerName' => $this->execution->layer->name ?? null,
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
