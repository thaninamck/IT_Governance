<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Repositories\V1\MajorProcessRepository;
use App\Repositories\V1\SourceRepository;

class SourceService
{
private $sourceRepository;
public function __construct(SourceRepository $sourceRepository){
    $this->sourceRepository = $sourceRepository;
}
public function firstOrCreate(array $data)
{
    return $this->sourceRepository->firstOrCreate($data);
}

}