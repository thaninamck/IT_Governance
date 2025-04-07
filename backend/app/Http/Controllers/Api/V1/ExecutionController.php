<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\V1\ControlService;
use App\Services\V1\MissionService;
use App\Services\V1\RiskService;
use Illuminate\Support\Facades\Validator;
use App\Models\Execution;
use Illuminate\Http\Request;
use App\Services\V1\ExecutionService;
use App\Http\Resources\Api\V1\ExecutionResource;
class ExecutionController extends BaseController
{

    protected $executionService;
    protected $missionService;
    protected $riskService;
    protected $controlService;

    public function __construct(ExecutionService $executionService, MissionService $missionService, RiskService $riskService, ControlService $controlService)
    {
        $this->executionService = $executionService;
        $this->missionService = $missionService;
        $this->riskService = $riskService;
        $this->controlService = $controlService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createExecutions(Request $request)
    {
        try {
            $rules = [
                'executions' => 'required|array',
                'executions.*.controlDescription' => 'required|string',
                'executions.*.controlId' => 'required|integer',
                'executions.*.controlModified' => 'required|boolean',
                'executions.*.controlOwner' => 'nullable|string',
                'executions.*.missionId' => 'nullable|integer',
                'executions.*.controlTester' => 'nullable|integer',

                'executions.*.layerId' => 'required|integer',
                'executions.*.riskDescription' => 'required|string',
                'executions.*.riskId' => 'required|integer',
                'executions.*.riskModified' => 'required|boolean',
                'executions.*.riskOwner' => 'nullable|string',
            ];
            \Log::info('Request Data:', $request->all());

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors(), 422);
            }
            $this->executionService->createExecutions($request->all());

            return $this->sendResponse("Execution created successfully", [], 201);

        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
    }





    /**
     * Display the specified resource.
     */
    public function getExecutionsByMission($missionId)
    {
        try {

            $executions = ExecutionResource::collection($this->executionService->getExecutionsByMission($missionId));
            if ($executions->isEmpty()) {
                return $this->sendError('Aucune exécution trouvée pour cette mission.', [], 404);
            }

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getExecutionsByMissionAndTester($missionId)
    {
        try {
            $userId = auth()->user()->id;
            
            $executions = ExecutionResource::collection($this->executionService->getExecutionsByMissionAndTester($missionId,$userId));
            if ($executions->isEmpty()) {
                return $this->sendError('Aucune exécution trouvée pour cette mission et testeur.', [], 404);
            }

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Execution $execution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Execution $execution)
    {
        //
    }

    public function getWorkplanOptionsByMission($missionId)
{
    try {
        $data = [
            'systems' => $this->missionService->getSystemsByMissionID($missionId), // Déjà un array
            'risks' => $this->riskService->getAllRisks(), // Collection
            'controls' => $this->controlService->getAllControls() // Collection
        ];

        return $this->sendResponse(
            (new ExecutionResource(null))->formatWorkplanOptions($data),
            'Workplan options retrieved successfully.'
        );

    } catch (\Exception $e) {
        return $this->sendError('Failed to retrieve workplan options.', ['error' => $e->getMessage()], 500);
    }
}

}
