<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SubProcessRepository;

class MajorProcessService
{
private $majorProcessRepository;
public function __construct(MajorProcessRepository $majorProcessRepository){
    $this->majorProcessRepository = $majorProcessRepository;
}
public function firstOrCreate(array $data)
{
    return $this->majorProcessRepository->firstOrCreate($data);
}

}