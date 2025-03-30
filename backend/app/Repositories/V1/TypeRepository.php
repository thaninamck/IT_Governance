<?php

namespace App\Repositories\V1;
use App\Models\Type;
class TypeRepository
{
    public function firstOrCreate(array $data)
{
    return Type::firstOrCreate(
        //['id' => $data['id']],
        ['name' => $data['name'] ?? 'Type inconnu']
    );
}

public function getAllTypes()
{
    return Type::all();
}

}
