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