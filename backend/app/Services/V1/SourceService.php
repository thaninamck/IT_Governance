<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Models\Source;
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

public function getAllSources(){
    return $this->sourceRepository->getAllSources();
}
public function createSource(string $name):Source
{
    // Vérifier si une csource avec le même nom existe déjà (en ignorant la casse)
    $existingSource = Source::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();

    if ($existingSource) {
        throw new \Exception("Une source avec le même nom existe déjà.");
    }
    return $this->sourceRepository->createSource($name);
}
public function deleteSource(int $id) :?string
{
    $layer=$this->sourceRepository->findSourceById($id);
    if(!$layer){
        return null;
    }
    return $this->sourceRepository->deleteSource($id);
}

}