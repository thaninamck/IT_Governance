<?php

namespace App\Repositories\V1;

use App\Models\Source;

class SourceRepository
{
    public function getAllSources()
    {
        return Source::all();
    }

    public function createSource(string $name):Source
    {
        return Source::create(['name' => $name]);
    }

    public function findSourceById(int $id)
    {
        return Source::find($id);
    }

    public function deleteSource(int $id): ?string
    {
        $source=Source::find($id);
        if(!$source){
            return null;
        }
        $name=$source->name;
        $source->delete();

        return $name;
    }
}
