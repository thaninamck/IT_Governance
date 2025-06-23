<?php

namespace App\Repositories\V1;

use App\Models\Status;

class StatusRepository
{
    public function getExecutionStatusOptions()
    {
        return Status::where('entity', 'execution')
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
    
    public function getAllStatus()
    {
        return Status::all();
    }

    public function createStatus(string $status_name ,string $entity):Status
    {
        return Status::create(['status_name' => $status_name,'entity'=>$entity]);
    }

    public function findStatusById(int $id)
    {
        return Status::find($id);
    }

    public function deleteStatus(int $id): ?string
    {
        $status=Status::find($id);
        if(!$status){
            return null;
        }
        $name=$status->status_name;
        $status->delete();

        return $name;
    }

    public function hasRelatedData(Status $status): bool
    {
        return 
        $status->executions()->exists();
    }
}
