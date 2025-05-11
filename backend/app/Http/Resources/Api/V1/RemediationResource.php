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
            //info de la remediation
            'id' => $this->id,
            'actionName' => $this->action_name,
            'description' => $this->description,
            'ownerContact' => $this->owner_cntct,
            'suivi' => $this->follow_up,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'statusId' => $this->status_id,
            'statusName' => $this->status ? $this->status->status_name : 'Non Commencée',
            'remediation_evidences' => $this->remediationEvidence->map(function ($evidence) {
                return [
                    'id' => $evidence->id,
                    'file_name' => $evidence->file_name,
                    'stored_name'=>$evidence->stored_name,
                ];
            }),

            //info de l'execution
            'executionId' => $this->execution_id,
            'controlCode' => optional($this->execution->steps->first()?->control)->code,
            'risk_owner' => optional($this->execution->coverage->first())->risk_owner,
            'control_owner' => $this->execution->control_owner ?? null,
            'remark' => $this->execution->remark ?? null,
            'launched_at' => $this->execution->launched_at ?? null,
            'executionStatus' => $this->execution->status->status_name ?? null,

            //indo de testeur 
            'testeurid' => $this->execution->user->id ?? null,
            'testeurName' => $this->execution->user->first_name ?? null,
            'testeurEmail' => $this->execution->user->email ?? null,
           // 'userProfile'=>$this->execution->user->participations->profile->profile_name ?? null,

            //info du systeme
            'SystemName' => $this->execution->layer->system->name,
            'ownerSystem' => optional($this->execution->layer->system->owner)->full_name,
            'ownerSystem_email' => optional($this->execution->layer->system->owner)->email,
            'layerName' => $this->execution->layer->name ?? null,

            //info de la mission
            'missionName' => $this->execution->layer->system->mission->mission_name ?? null,
            'missionClient' => $this->execution->layer->system->mission->client->commercial_name ?? null,





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
