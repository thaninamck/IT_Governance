<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ControlResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
           return['id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'type' => $this->type ? [$this->type->id, $this->type->name] : null,
            'majorProcess' => $this->majorProcess->description ?? null,

            'majorProcessId' => $this->majorProcess->id ?? null,
            'majorProcessCode' => $this->majorProcess->code ?? null,
            'subProcess' => $this->subProcess->name ?? null,
            'subProcessId' => $this->subProcess->id ?? null,

            'subProcessCode' => $this->subProcess->code ?? null,
            'sources' => $this->sources->map(fn($source) => [$source->id, $source->name])->toArray(),
            'testScript' => $this->test_script,];
    }
}
