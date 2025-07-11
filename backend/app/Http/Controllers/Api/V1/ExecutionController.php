<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Participation;
use App\Services\V1\ControlService;
use App\Services\V1\EvidenceService;
use App\Services\V1\MissionService;
use App\Services\V1\RiskService;
use Illuminate\Support\Facades\Validator;
use App\Models\Execution;
use Illuminate\Http\Request;
use App\Services\V1\ExecutionService;
use App\Http\Resources\Api\V1\ExecutionResource;
use App\Http\Resources\Api\V1\MissionResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Log;

class ExecutionController extends BaseController
{

    protected $executionService;
    protected $missionService;
    protected $riskService;
    protected $controlService;
    protected $evidenceService;
    protected $notificationService;
    public function __construct(ExecutionService $executionService, MissionService $missionService, RiskService $riskService, ControlService $controlService, EvidenceService $evidenceService,NotificationService $notificationService)
    {
        $this->evidenceService = $evidenceService;
        $this->executionService = $executionService;
        $this->missionService = $missionService;
        $this->riskService = $riskService;
        $this->controlService = $controlService;
        
        $this->notificationService = $notificationService;
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


    public function getBeganExecutionsByMission($mission)
    {
        try {

            $executions = $this->executionService->getBeganExecutionsByMission($mission);
           

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getUnbeganExecutionsByMission($mission)
    {
        try {

            $executions = $this->executionService->getUnbeganExecutionsByMission($mission);
           

            return $this->sendResponse(
                $executions,
                'Liste des exécutions récupérée avec succès.'
            );
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des exécutions.', ['error' => $e->getMessage()], 500);
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

    public function updateComment(Request $request,$mission, $id)
    {
        try {
            $rules = [
                'text' => 'required|string',
            ];
            $validator = Validator::make($request->all(), $rules);
    
            if ($validator->fails()) {
                return $this->sendError("Validation échouée", $validator->errors(), 422);
            }
    
            $this->executionService->updateComment($id, $request->text);
            return $this->sendResponse([], 'Commentaire mis à jour avec succès');
        } catch (\Exception $e) {
            return $this->sendError("Erreur lors de la mise à jour du commentaire", ['error' => $e->getMessage()], 500);
        }
    }
    
    public function deleteComment($mission,$id)
    {
        try {
            $this->executionService->deleteComment($id);
            return $this->sendResponse([], 'Commentaire supprimé avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression du commentaire', [
                'comment_id' => $id,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // optionnel mais utile pour debug
            ]);
    
            return $this->sendError("Erreur lors de la suppression du commentaire", ['error' => $e->getMessage()], 500);
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

    public function createComment(Request $request)
    {
        try {
            $rules = [
                'user_id' => 'required|int',
                'y'=> 'required|numeric',
                'text'=> 'required|string',
                'execution_id'=>'required|int'
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors(), 422);
            }
            $this->executionService->createComment($request->all());

            return $this->sendResponse("Commment created successfully", [], 201);
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
       
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateExecution1(Request $request, $executionId)
    {
        
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
    public function getAllExecutionsByApp($mission,$appId)
    {
        try {

            $executions = ExecutionResource::collection($this->executionService->getAllExecutionsByApp($appId));
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

    public function getExecutionsByMissionAndSystemAndTesterFiltered($missionId, $appId)
    {
        try {
            $userId = auth()->user()->id;

            $executions = ExecutionResource::collection($this->executionService->getExecutionsByMissionAndSystemAndTesterFiltered($missionId, $userId, $appId));
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



    public function updateExecution(Request $request,$mission, $executionId)
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
            'steps' => 'sometimes|array',
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
        
            $returnedExecution = $this->executionService->updateExecution($executionId, $data);
            // return $this->sendResponse(
            //     "Execution updated successfully",
            //     [],
            //     200
            // );

            return response()->json($returnedExecution, 200);
            
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
    public function getEffectiveExecutionsByMission($mission)
    {
        try {
            $data = $this->executionService->getEffectiveExecutionsByMission($mission);
            return $this->sendResponse($data, "Executions  retrieved successfully", 200);
        } catch (\Exception $e) {
            return $this->sendError("Error while retrieving executions", ['error' => $e->getMessage()], 500);
        }
    }
    public function getIneffectiveExecutionsByMission($mission)
    {
        try {
            $data = $this->executionService->getIneffectiveExecutionsByMission($mission);
            return $this->sendResponse($data, "Executions  retrieved successfully", 200);
        } catch (\Exception $e) {
            return $this->sendError("Error while retrieving executions", ['error' => $e->getMessage()], 500);
        }
    }
    public function launchExecution($missionId,$executionId)
    {
        try {
            return $this->executionService->launchExecution($missionId,$executionId) ? $this->sendResponse("Execution launched successfully", [], 200) : $this->sendError("launching execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while launching execution", ['error' => $e->getMessage()], 500);
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
                'systems' => $this->missionService->getSystemsByMissionIDforOption($missionId), // Déjà un array
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


// gestion Revue 

    public function getexecutionReviewBySuperviseur($missionId): JsonResponse
    {
        try {
            
            $executionReviewed = $this->executionService->getexecutionReviewBySuperviseur($missionId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return $this->sendResponse( ExecutionResource::structuredResponse($executionReviewed), 'Liste des remediations récupérée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getAllExecutionReview($missionId): JsonResponse
    {
        try {
            
            $executionReviewed = $this->executionService->getAllExecutionReview($missionId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return $this->sendResponse( ExecutionResource::structuredResponse($executionReviewed), 'Liste des remediations récupérée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }
    public function getAllExecutionReviewAdmin($missionId ,$appId): JsonResponse
    {
        try {
            
            $executionReviewed = $this->executionService->getAllExecutionReviewAdmin($missionId,$appId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return $this->sendResponse( ExecutionResource::structuredResponse($executionReviewed), 'Liste des remediations récupérée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getmissionReviewBySuperviseur(): JsonResponse
    {
        try {
            $userId = auth()->user()->id;
            $executionReviewed = $this->executionService->getmissionReviewBySuperviseur($userId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune mission execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return 
            //$this->sendResponse( MissionResource::collection($executionReviewed), 'Liste des remediations récupérée avec succès.');
            response()->json($executionReviewed);
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des mission execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getexecutionReviewByManager($missionId): JsonResponse
    {
        try {
            $executionReviewed = $this->executionService->getexecutionReviewByManager($missionId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return $this->sendResponse( ExecutionResource::structuredResponse($executionReviewed), 'Liste des remediations récupérée avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getmissionReviewManager(): JsonResponse
    {
        try {
            $userId = auth()->user()->id;
            
            $executionReviewed = $this->executionService->getmissionReviewManager($userId);
            if (!isset($executionReviewed)) {
                return $this->sendError('Aucune mission execution Reviewed trouvé pour cette execution.', [], 404);
            }

            // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return 
            //$this->sendResponse( MissionResource::collection($executionReviewed), 'Liste des remediations récupérée avec succès.');
            response()->json($executionReviewed);
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des mission execution Reviewed.', ['error' => $e->getMessage()], 500);
        }
    }


    public function submitExecutionForReview($mission,$executionID)
    {
        try {

            return $this->executionService->submitExecutionForReview($mission,$executionID) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
            
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }

  

    public function submitExecutionForValidation($mission,$executionID)
    {
        try {
            return $this->executionService->submitExecutionForValidation($mission,$executionID) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }

    public function submitExecutionForCorrection($mission,$system,$executionId)
    {
        try {
            return $this->executionService->submitExecutionForCorrection($mission,$system,$executionId) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }

    public function submitExecutionForFinalValidation($mission,$executionId)
    {
        try {
            return $this->executionService->submitExecutionForFinalValidation($executionId) ? $this->sendResponse("Execution submitted successfully", [], 200) : $this->sendError("submitting execution failed", [], 404);
        } catch (\Exception $e) {
            return $this->sendError("Error while submitting execution", ['error' => $e->getMessage()], 500);
        }
    }

}
