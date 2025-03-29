<?php
namespace App\Services\V1;

use App\Repositories\V1\RiskRepository;
use Illuminate\Support\Facades\Hash;
use App\Models\Risk;
class RiskService
{

    protected riskRepository $riskRepository;

    public function __construct(RiskRepository $riskRepository)
    {
        $this->riskRepository = $riskRepository;
    }
    public function createRisk(array $data)
    {
        $risk = $this->riskRepository->createRisk($data);
    
        if (!$risk) {
            throw new \Exception("Ce risque existe déjà !");
        }
    
        return $risk;
    }
    

public function createMultipleRisks(array $risksData)
{
    $createdRisks = [];

    foreach ($risksData as $data) {
        $createdRisks[] = $this->createRisk($data);
    }

    return $createdRisks;
}

public function getRiskById($id)
    {
        return $this->riskRepository->getRiskById($id);
    }
    public function getAllRisks()
    {
        return $this->riskRepository->getAllRisks();
    }
    public function updateRisk($risk, array $data)
    {
        $updated = $this->riskRepository->updateRisk($risk, $data);
    
        if (!$updated) {
            return null;
        }
    
        return $risk->refresh(); 
    }
    
    public function deleteRisk($id){
        $risk=$this->riskRepository->getRiskById($id);
        if (!($this->riskRepository->hasRelatedData($risk))) {
           return  $this->riskRepository->deleteRisk($risk);
        }
    }

    public function deleteMultipleRisks(array $ids)
{
    $deletedRisks = [];

    foreach ($ids as $id) {
        if ($this->deleteRisk($id)) {
            $deletedRisks[] = $id;
        }
    }

    return $deletedRisks;
}

}