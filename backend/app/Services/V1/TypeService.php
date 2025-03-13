<?php
namespace App\Services\V1;

use App\Models\Type;
use App\Repositories\V1\TypeRepository;

class TypeService
{
    protected TypeRepository $typeRepository;

    public function __construct(TypeRepository $typeRepository)
    {
        $this->typeRepository=$typeRepository;
    }
    public function getAllTypes(){
        return $this->typeRepository->getAllTypes();
    }
    public function createType(string $name):Type
    {
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