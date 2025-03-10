<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'commercialName'=>$this->commercial_name,
            'socialReason'=>$this->social_reason,
            'correspondence'=>$this->correspondence,
            'address'=>$this->address,
            'contact1'=>$this->contact_1,
            'contact2'=>$this->contact_2,
        ];
    }
}