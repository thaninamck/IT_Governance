<?php

namespace App\Repositories\V1;

use App\Models\MajorProcess;

class MajorProcessRepository
{
    public function findById($id)
    {
        return MajorProcess::where('id', $id)->first();
    }

    public function update(MajorProcess $majorProcess, array $data)
    {
        if (isset($data['designation'])) {
            $majorProcess->description = $data['designation'];
        }
        if (isset($data['code'])) {
            $majorProcess->code = $data['code'];
        }
        $majorProcess->save();

        return $majorProcess;
    }

    public function firstOrCreate(array $data)
{
    return MajorProcess::firstOrCreate(
        
        [
            'code' => $data['code']],
            ['description' => $data['description']
        ]
    );
}

}
