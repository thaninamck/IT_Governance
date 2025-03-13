<?php

namespace App\Repositories\V1;

use App\Models\Layer;

class LayerRepository
{
    public function getAllLayers()
    {
        return Layer::all();
    }

    public function createLayer(string $name):Layer
    {
        return Layer::create(['name' => $name]);
    }

    public function findLayerById(int $id)
    {
        return Layer::find($id);
    }

    public function deleteLayer(int $id): ?string
    {
        $layer=Layer::find($id);
        if(!$layer){
            return null;
        }
        $name=$layer->name;
        $layer->delete();

        return $layer;
    }
}
