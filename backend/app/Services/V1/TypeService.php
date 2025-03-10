<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\TypeRepository;

class TypeService
{
private $typeRepository;
public function __construct(TypeRepository $typeRepository){
    $this->typeRepository = $typeRepository;
}
public function firstOrCreate(array $data)
{
    return $this->typeRepository->firstOrCreate($data);
}

}