<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\V1\ControlService;
use App\Services\V1\EvidenceService;
use App\Services\V1\MissionService;
use App\Services\V1\RiskService;
use Illuminate\Support\Facades\Validator;
use App\Models\Execution;
use Illuminate\Http\Request;
use App\Services\V1\ExecutionService;
use App\Http\Resources\Api\V1\ExecutionResource;
use Log;

class ExecutionController extends BaseController
{

    protected $executionService;
    protected $missionService;
    protected $riskService;
    protected $controlService;
    protected $evidenceService;
    public function __construct(ExecutionService $executionService ,MissionService $missionService, RiskService $riskService, ControlService $controlService, EvidenceService $evidenceService)
    {
        $this->evidenceService = $evidenceService;
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

            $executions = ExecutionResource::collection($this->executionService->getExecutionsByMissionAndTester($missionId, $userId));
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
    public function getExecutionById($missionId,$executionId)
    {
       
        $returnedExecution = $this->executionService->getExecutionById($executionId);
        if ($returnedExecution) {
            return $this->sendResponse(
                $returnedExecution,
                'Execution retrieved successfully'
            );
        } else {
            return $this->sendError('Execution Not found', [], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateExecution1(Request $request, $executionId)
    {
        Log::info('executionId:', [$executionId]);

        Log::info('Request all:', $request->all());
        Log::info('Request raw content:', [$request->getContent()]);
        Log::info('All inputs:', $request->input());
        Log::info('All files:', $request->file('files'));
        $rules = [
            'description' => 'required|string',
            'files' => 'sometimes|array',

            'files.*.file' => 'file|max:10240', // Validation pour chaque fichier
            'files.*.is_f_test' => 'required|boolean', // Validation pour chaque champ 'is_f_test'
            'comment' => 'sometimes|string',
            'status_id' => 'sometimes|integer',
            'effectiveness' => 'sometimes|boolean',
            'design' => 'sometimes|boolean',
            'ipe' => 'sometimes|boolean',
        ];

        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation of data failed", $validator->errors(), 422);
        }


        $data = $validator->validated();
        Log::info("data", $data);

        try {
            // Appel au service pour mettre à jour l'exécution
            $this->executionService->updateExecution($executionId, $data);
            return $this->sendResponse(
                "Execution updated successfully",
                [],
                200
            );
        } catch (\Exception $e) {
            return $this->sendError("Error while updating execution", ['error' => $e->getMessage()], 500);
        }
    }

    public function getExecutionsByApp($appId)
    {
        try {

            $executions = ExecutionResource::collection($this->executionService->getExecutionsByApp($appId));
            if ($executions->isEmpty()) {
                return $this->sendError('Aucune exécution trouvée pour cette system.', [], 404);
            }

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getExecutionsByMissionAndSystemAndTester($missionId, $appId)
    {
        try {
            $userId = auth()->user()->id;

            $executions = ExecutionResource::collection($this->executionService->getExecutionsByMissionAndSystemAndTester($missionId, $userId, $appId));
            if ($executions->isEmpty()) {
                return $this->sendError('Aucune exécution trouvée pour cette mission et system et testeur.', [], 404);
            }

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
        }
    }

    

    public function updateExecution(Request $request, $executionId)
    {
        Log::info('executionId:', [$executionId]);

        Log::info('Request all:', $request->all());
        $rules = [
            'description' => 'sometimes|string',
            'riskModification' => 'sometimes|string',
            'riskOwner' => 'sometimes|string',
            'controlOwner' => 'sometimes|string',
            'comment' => 'sometimes|nullable|string',
            'status_id' => 'sometimes|nullable|integer',
            'effectiveness' => 'sometimes|boolean ',
            'design' => 'sometimes|boolean',
            'ipe' => 'sometimes|boolean',
            'controlTester' => 'sometimes|integer',
            'steps'=> 'sometimes|array',
        ];

        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation of data failed", $validator->errors(), 422);
        }


        $data = $validator->validated();
        Log::info("data", $data);

        try {
            // Appel au service pour mettre à jour l'exécution
            $this->executionService->updateExecution($executionId, $data);
            return $this->sendResponse(
                "Execution updated successfully",
                [],
                200
            );
        } catch (\Exception $e) {
            return $this->sendError("Erreur lors de la mise à jour", ['error' => $e->getMessage()], 500);
        }
    }


    public function updateMultipleExecutions(Request $request)
    {
        $rules = [
            'executions' => 'required|array',
            'executions.*.controlModification' => 'sometimes|nullable|string',
            'executions.*.comment' => 'sometimes|nullable|string',
            'executions.*.covId' => 'sometimes|nullable|integer',
            'executions.*.id' => 'required|integer|exists:executions,id',

            'executions.*.controlTester' => 'sometimes|nullable|integer',
            'executions.*.riskOwner' => 'sometimes|nullable|string',
            'executions.*.controlOwner' => 'sometimes|nullable|string',
            'executions.*.riskModification' => 'sometimes|nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation failed", $validator->errors(), 422);
        }

        try {
            $this->executionService->updateMultipleExecutions($request->input('executions'));

            return $this->sendResponse("Executions updated successfully", [], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour des exécutions : " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return $this->sendError("Error while updating executions", ['error' => $e->getMessage()], 500);
        }
    }

    public function deleteExecutions(Request $request)
    {
        try {
            // Récupérer les IDs des exécutions depuis la requête
            $executionsIds = $request->input('executionsIds');

            // Vérifier que les IDs ont bien été fournis
            if (empty($executionsIds)) {
                return $this->sendError("Aucun ID d'exécution fourni", [], 400);
            }

            // Appeler le service pour supprimer les exécutions
            $undeletableIds = $this->executionService->deleteExecutions($executionsIds);

            // Si certaines exécutions n'ont pas pu être supprimées
            if (!empty($undeletableIds)) {
                return $this->sendResponse(
                    [
                        'undeletable_ids' => $undeletableIds
                    ],
                    'Certaines exécutions n\'ont pas pu être supprimées (elles ont des données liées).',
                    400
                );
            }

            // Si tout s'est bien passé
            return $this->sendResponse(
                "Toutes les exécutions ont été supprimées avec succès.",
                [],
                200
            );
        } catch (\Exception $e) {
            // Gestion des erreurs en cas de problème
            Log::error('Erreur lors de la suppression des exécutions : ' . $e->getMessage());
            return $this->sendError("Erreur lors de la suppression des exécutions.", ['error' => $e->getMessage()], 500);
        }
    }

    public function getExecutionStatusOptions()
    {
        try {
            $data = $this->executionService->getExecutionStatusOptions();
            return $this->sendResponse($data, "Execution status options retrieved successfully", 200);
        } catch (\Exception $e) {
            return $this->sendError("Error while retrieving execution status options", ['error' => $e->getMessage()], 500);
        }
    }
    public function launchExecution($executionId)
    {
        try {
            return $this->executionService->launchExecution($executionId) ? $this->sendResponse("Execution launched successfully", [], 200) : $this->sendError("launching execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while launching execution", ['error' => $e->getMessage()], 500);
        }
    }

    public function submitExecutionForReview($executionId)
    {
        try {
            return $this->executionService->submitExecutionForReview($executionId) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }

    public function submitExecutionForValidation($executionId)
    {
        try {
            return $this->executionService->submitExecutionForValidation($executionId) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }
    public function storeFile(Request $request)
    {
        $rules = [
            'file' => 'required|file|max:10240', // Taille max de 10 Mo
            'execution_id' => 'sometimes',
            'remediation_id' => 'sometimes',

            'is_f_test' => 'sometimes|boolean',
        ];

        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation of data failed", $validator->errors(), 422);
        }
        $data = [
            'execution_id' => $request->execution_id,
            'remediation_id' => $request->remediation_id,
            'is_f_test' => $request->is_f_test,
        ];
        try {
            // Appel au service pour stocker le fichier et les données associées
            $this->evidenceService->storeFile($data, $request->file('file'));

            return $this->sendResponse("File uploaded successfully", [], 201);
        } catch (\Exception $e) {
            // Gestion des erreurs si le service échoue
            return $this->sendError("Error while uploading file", ['error' => $e->getMessage()], 500);
        }
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

            if ($data['systems'] instanceof \Illuminate\Http\JsonResponse) {
                $data['systems'] = $data['systems']->getData(true);
            }
            return $this->sendResponse(
                (new ExecutionResource(null))->formatWorkplanOptions($data),
                'Workplan options retrieved successfully.'
            );
        } catch (\Exception $e) {
            Log::error('Erreur getWorkplanOptionsByMission: ' . $e->getMessage());
            return $this->sendError('Failed to retrieve workplan options.', ['error' => $e->getMessage()], 500);
        }
    }
}
