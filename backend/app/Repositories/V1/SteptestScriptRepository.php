<?php

namespace App\Repositories\V1;
use App\Models\StepTestScript;
use App\Models\StepExecution;
class StepTestScriptRepository
{
    public function create(array $data)
    {
        return StepTestScript::create($data);
    }

    public function update(array $data, $id)
    {
        return StepExecution::where('id', $id)->update($data);

    }
}
