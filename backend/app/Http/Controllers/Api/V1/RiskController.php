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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Risk $risk)
    {
        //
    }

      //
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Risk $risk)
    {
        //
    }
}
