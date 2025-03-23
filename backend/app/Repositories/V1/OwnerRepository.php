<?php

namespace App\Repositories\V1;

use App\Models\Owner;

class OwnerRepository
{
    public function getAllOwners()
    {
        return Owner::all();
    }

    public function createOwner(array $data):Owner
    {
        return Owner::create($data);
    }

    public function updateOwner($id ,array $data):Owner
    {
        $owner= Owner::find($id);

        // if(!$owner){
        //     return null;
        // }

        $owner->update($data);

        return $owner;
    }
    public function findOwnerById(int $id)
    {
        return Owner::find($id);
    }

    public function findOwnerByFullNameAndEmail(string $fullName, string $email): ?Owner
    {
        return Owner::where('full_name', $fullName)
            ->where('email', $email)
            ->first();
    }
    public function deleteOwner(int $id): ?string
    {
        $owner=Owner::find($id);

        if (!$owner) {
            return null;
        }

        $owner_name=$owner->full_name;
        $owner->delete();

        return $owner_name;
    }

}
