<?php
namespace App\Services\V1;

use App\Models\Status;
use App\Repositories\V1\StatusRepository;

class StatusService
{
    protected StatusRepository $statusRepository;

    public function __construct(StatusRepository $statusRepository)
    {
        $this->statusRepository=$statusRepository;
    }
    public function getAllStatus(){
        return $this->statusRepository->getAllStatus();
    }
    public function createStatus(string $status_name, string $entity): Status
{
    // Vérifier si un status avec le même nom existe déjà (en ignorant la casse)
    $existingStatus = Status::whereRaw(
        'LOWER(entity) = ? AND LOWER(status_name) = ?',
        [strtolower($entity), strtolower($status_name)]
    )->first();
    

    if ($existingStatus) {
        throw new \Exception("Un status avec le même nom existe déjà.");
    }

    return $this->statusRepository->createStatus($status_name, $entity);
}

    public function deleteStatus(int $id) :?string
    {
        $status=$this->statusRepository->findStatusById($id);
        if(!$status){
            return null;
        }
        if ($this->statusRepository->hasRelatedData($status)) {
            throw new \Exception("Impossible de supprimer ce satatus, des données lui sont encore associées.");
        }
        return $this->statusRepository->deleteStatus($id);
    }
}
