<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'description'=>$this->description,
            'missionId'=>$this->mission_id,
           // 'missionName'=>$this->mission->mission_name,
            'ownerId'=>$this->owner_id,
            'ownerName' => $this->owner->full_name ?? 'N/A', // Ajout d'une valeur par défaut
        'ownerContact' => $this->owner->email ?? 'N/A',  // Ajout d'une valeur par défaut
        'layers' => $this->whenLoaded('layers', function () {
            return $this->layers->pluck('name'); // Retourne seulement les noms
            
            // OU si vous voulez tous les détails des layers :
            // return LayerResource::collection($this->layers);
        }, []),
        ];
    }
}
