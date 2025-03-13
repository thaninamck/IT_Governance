<?php
namespace App\Services\V1;

use App\Models\Source;
use App\Repositories\V1\SourceRepository;

class SourceService
{
    protected SourceRepository $sourceRepository;

    public function __construct(SourceRepository $sourceRepository)
    {
        $this->sourceRepository=$sourceRepository;
    }
    public function getAllSources(){
        return $this->sourceRepository->getAllSources();
    }
    public function createSource(string $name):Source
    {
        return $this->sourceRepository->createSource($name);
    }
    public function deleteSource(int $id) :?string
    {
        $layer=$this->sourceRepository->findSourceById($id);
        if(!$layer){
            return null;
        }
        return $this->sourceRepository->deleteSource($id);
    }
}