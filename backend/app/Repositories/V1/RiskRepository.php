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
        return Risk::Where('id',$riskId)->first();
    }
    public function updateRisk(Risk $risk, array $data)
{
    return $risk->update($data);
}

public function createRisk(array $data)
{
    $existingRisk = Risk::where('code', $data['code'])
        ->where('name', $data['name'])
        ->where('description', $data['description'])
        ->first();

    if ($existingRisk) {
        return null; // Retourne null si le risque existe déjà
    }

    return Risk::create($data);
}

public function hasRelatedData(Risk $risk){
    return $risk->coverage()->exists() ;
}
public function deleteRisk(Risk $risk){
    return $risk->delete();
}
}
