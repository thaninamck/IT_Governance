<?php

namespace App\Http\Resources\Api\V1;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
        'message' => $this->data['message'] ?? '',
        'url' => $this->data['url'] ?? null,
        'type' => $this->data['type'] ?? 'info',
        'read_at' => $this->read_at, // null si non lue
        'created_at' => Carbon::parse($this->created_at)->locale('fr')->diffForHumans(),
    ];
}

}
