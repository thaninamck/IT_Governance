<?php

namespace App\Repositories\V1;
use App\Models\StepTestScript;
class StepTestScriptRepository
{
    public function create(array $data)
    {
        return StepTestScript::create($data);
    }

}
