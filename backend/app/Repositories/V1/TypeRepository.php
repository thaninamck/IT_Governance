<?php

namespace App\Repositories\V1;

use App\Models\Type;

class TypeRepository
{
    public function getAllTypes()
    {
        return Type::all();
    }

    public function createType(string $name):Type
    {
        return Type::create(['name' => $name]);
    }

    public function findTypeById(int $id)
    {
        return Type::find($id);
    }

    public function deleteType(int $id): ?string
    {
        $type=Type::find($id);
        if(!$type){
            return null;
        }
        $name= $type->name;
        $type->delete();

        return $name;
    }
}
