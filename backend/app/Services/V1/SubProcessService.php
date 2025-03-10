<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SubProcessRepository;

class SubProcessService
{
private $subProcessRepository;
public function __construct(SubProcessRepository $subProcessRepository){
    $this->subProcessRepository = $subProcessRepository;
}
public function firstOrCreate(array $data)
{
    return $this->subProcessRepository->firstOrCreate($data);
}

}