<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MissionResource extends JsonResource
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
            'clientName' => $this->client->commercial_name,
            'missionName' => $this->mission_name,
            'manager' => $this->participations
                ->where('profile_id', 3)
                ->map(function ($participation) {
                    return (
                        $participation->user->first_name ?? 'N/A') . ' ' . ($participation->user->last_name ?? '');
                })->first(),
            'managerID' => $this->participations
                ->where('profile_id', 3)
                ->map(function ($participation) {
                    return (
                        $participation->user->id);
                })->first(),


            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'auditStartDate' => $this->audit_start_date,
            'auditEndDate' => $this->audit_end_date,
            'status' => $this->status->status_name,
            'clientName' => $this->client->commercial_name,
            'statusId' => $this->status_id,
            'clientId' => $this->client_id,

        ];
    }
}
