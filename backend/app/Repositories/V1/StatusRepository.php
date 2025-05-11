<?php

namespace App\Repositories\V1;

use App\Models\Status;

class StatusRepository
{
    public function getExecutionStatusOptions()
    {
        return Status::where('entity', 'control')
                     ->select('id', 'status_name')
                     ->get();
    }

    public function getRemediationStatusOptions()
    {
        return Status::where('entity', 'remediation')
                     ->select('id', 'status_name')
                     ->get();
    }

    public function getMissionStatusByName(string $name)
    {
        return Status::
                     where('status_name', $name)
                     ->first();
    }

    public function getMissionStatusById(int $id)
    {
        return Status::
                     where('id', $id)
                     ->first();
    }
    
}
