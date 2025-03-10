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
            'statusId' => $this->status_id,
            'missionName' => $this->mission_name,
            'clientId' => $this->client_id,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
        ];
    }
}
