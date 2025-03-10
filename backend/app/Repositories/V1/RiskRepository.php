<?php

namespace App\Repositories\V1;
use App\Models\Risk;
class RiskRepository
{
    public function getAllRisks()
    {
        return Risk::all();
    }

    public function getRiskById($riskId){
        return Risk::find($riskId);
    }
    public function updateRisk(Risk $risk, array $data)
{
    return $risk->update($data);
}

}
