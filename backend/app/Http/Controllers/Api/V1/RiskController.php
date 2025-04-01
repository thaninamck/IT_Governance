<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Risk;
use Illuminate\Http\Request;
use App\Services\V1\RiskService;
use App\Http\Resources\Api\V1\RiskResource;

class RiskController extends BaseController
{
    protected $riskService;
    public function __construct(RiskService $riskService)
    {
        $this->riskService = $riskService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $risks = $this->riskService->getAllRisks();

        if ($risks->isEmpty()) {
            return $this->sendError("No risk found", []);
        }

        return $this->sendResponse(RiskResource::collection($risks), "risks retrieved successfully");
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:255|unique:risks,code',
            'name' => 'required|string|max:255|unique:risks,name',
            'description' => 'nullable|string',
        ]);
    
        try {
            $risk = $this->riskService->createRisk($data);
            return $this->sendResponse(new RiskResource($risk), "Risque créé avec succès");
        } catch (\Exception $e) {
            return $this->sendError("Erreur lors de la création du risque", $e->getMessage(), 409);
        }
    }
    
    
    public function storeMultiple(Request $request)
{
    $risksData = $request->validate([
        '*.code' => 'required|string|max:255',
        '*.name' => 'required|string|max:255',
        '*.description' => 'nullable|string',
    ]);

    $risks = $this->riskService->createMultipleRisks($risksData);

    if (empty($risks)) {
        return $this->sendError("Erreur lors de la création des risques", []);
    }

    return $this->sendResponse(RiskResource::collection($risks), "Risques créés avec succès");
}




    public function updateRisk(Request $request, $id)
{
    $risk = $this->riskService->getRiskById($id);

    if (!$risk) {
        return $this->sendError("Risk not found", []);
    }

    $data = $request->validate([
        'code' => 'sometimes|string|max:255',
        'name' => 'sometimes|string|max:255',
        'description' => 'sometimes|string',
    ]);

    $updatedRisk = $this->riskService->updateRisk($risk, $data);

    if (!$updatedRisk) {
        return $this->sendError("Error updating risk", []);
    }

    return $this->sendResponse(new RiskResource($updatedRisk), "Risk updated successfully");
}

    /**
     * Store a newly created resource in storage.
     */
 

    /**
     * Display the specified resource.
     */
    public function deleteMultipleRisks(Request $request)
{
    $ids = $request->input('ids');

    if (empty($ids) || !is_array($ids)) {
        return $this->sendError("Aucun risque sélectionné", []);
    }

    $deletedRisks = $this->riskService->deleteMultipleRisks($ids);

    if (empty($deletedRisks)) {
        return $this->sendError("Aucun risque supprimé", []);
    }

    return $this->sendResponse(["deleted_ids" => $deletedRisks], "Risques supprimés avec succès");
}


      //
    

    /**
     * Remove the specified resource from storage.
     */
    public function deleteRisk($id){
        if(!$this->riskService->deleteRisk($id)){
            return $this->sendError("Erreur lors de la suppression du risque", []);
        }
        return $this->sendResponse(["risque supprimé avec succées" ],"risque supprimé ");
    }
}
