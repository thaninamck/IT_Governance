<?php
namespace App\Services\V1;

use App\Models\Layer;
use App\Repositories\V1\LayerRepository;

class LayerService
{
    protected LayerRepository $layerRepository;

    public function __construct(LayerRepository $layerRepository)
    {
        $this->layerRepository=$layerRepository;
    }
    public function getAllLayers(){
        return $this->layerRepository->getAllLayers();
    }
    public function createLayer(string $name):Layer
    {
        // Vérifier si une couche avec le même nom existe déjà (en ignorant la casse)
        $existingLayer = Layer::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();

        if ($existingLayer) {
            throw new \Exception("Une couche avec le même nom existe déjà.");
        }

        return $this->layerRepository->createLayer($name);
    }
    public function deleteLayer(int $id) :?string
    {
        $layer=$this->layerRepository->findLayerById($id);
        if(!$layer){
            return null;
        }
        return $this->layerRepository->deleteLayer($id);
    }
}