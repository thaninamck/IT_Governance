<?php

namespace App\Repositories\V1;
use App\Models\Source;
class SourceRepository
{
    public function firstOrCreate(array $data)
{
    return Source::firstOrCreate(
        //['id' => $data['id']],
        ['name' => $data['name'] ?? 'Source inconnue']
    );
}
public function getAllSources()
{
    return Source::all();
}

}
