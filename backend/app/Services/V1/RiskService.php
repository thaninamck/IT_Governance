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
    

}