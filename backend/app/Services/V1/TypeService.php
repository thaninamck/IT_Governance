<?php

namespace App\Services\V1;

use App\Repositories\V1\ControlRepository;
use App\Models\Control;
use App\Models\SubProcess;
use App\Models\MajorProcess;
use App\Models\Type;
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

public function getAllTypes(){
    return $this->typeRepository->getAllTypes();
}
public function createType(string $name):Type
{
    // Vérifier si une couche avec le même nom existe déjà (en ignorant la casse)
    $existingType = Type::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();

    if ($existingType) {
        throw new \Exception("Un type avec le même nom existe déjà.");
    }
    return $this->typeRepository->createType($name);
}
public function deleteType(int $id) :?string
{
    $type=$this->typeRepository->findTypeById($id);
    if(!$type){
        return null;
    }
    return $this->typeRepository->deleteType($id);
}

}