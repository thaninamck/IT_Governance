<?php

namespace App\Services\V1;

use App\Models\Owner;
use App\Repositories\V1\OwnerRepository;

class OwnerService
{
    protected OwnerRepository $ownerRepository;

    public function __construct(OwnerRepository $ownerRepository)
    {
        $this->ownerRepository=$ownerRepository;
    }

    public function getAllOwners()
    {
        return $this->ownerRepository->getAllOwners();
    }
    public function createOwner(array $data):Owner
    {
        return $this->ownerRepository->createOwner($data);
    }
    public function updateOwner($id ,array $data):?Owner
    {
        return $this->ownerRepository->updateOwner($id,$data);
    }
    public function findOwnerByFullNameAndEmail(string $fullName, string $email): ?Owner
    {
        return $this->ownerRepository->findOwnerByFullNameAndEmail($fullName,$email);
    }
    public function deleteOwner(int $id):?string
    {
        $owner=$this->ownerRepository->findOwnerById($id);
        if(!$owner){
            return null;
        }
        return $this->ownerRepository->deleteOwner($id);
    }

}