<?php

namespace App\Repositories\V1;

use App\Models\Layer;

class LayerRepository
{
   // Dans votre LayerRepository
   public function getAllLayers()
   {
       return Layer::all()->unique('name');
   }
    public function createLayer(string $name,int $systemId):Layer
    {
        return Layer::create([
            'name' => $name,
            'system_id' => $systemId
        ]);
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

        return $name;
    }
}
