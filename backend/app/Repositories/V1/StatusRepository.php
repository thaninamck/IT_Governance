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
    
}
