<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'firstName'=>$this->first_name,
            'lastName'=>$this->last_name,
            'email'=>$this->email,
            'phoneNumber'=>$this->phone_number,
            'grade'=>$this->grade,
            'role'=>$this->role == 0 ? 'user' : 'admin',
            'lastActivity'=>$this->last_activity,
            'lastPasswordChange'=>$this->last_password_change,
            'isActive'=>$this->is_active,
            'createdAt'=>$this->created_at,


        ];
    }
}
