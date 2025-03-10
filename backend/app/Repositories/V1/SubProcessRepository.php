<?php

namespace App\Repositories\V1;
use App\Models\SubProcess;
class SubProcessRepository
{
    public function findById($id)
    {
        return SubProcess::find($id);    }

    public function update(SubProcess $subProcess, array $data)
    {
        if (isset($data['name'])) {
            $subProcess->name = $data['name'];
        }
        if (isset($data['code'])) {
            $subProcess->code = $data['code'];
        }
       
        $subProcess->save();

        return $subProcess;
    }

    public function firstOrCreate(array $data)
{
    return SubProcess::firstOrCreate(
        
           ['code' => $data['code']] ,
            ['name' => $data['name']]
        
    )->refresh();
}

}
