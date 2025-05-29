<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\RemediationResource;
use App\Models\Remediation;
use App\Services\LogService;
use App\Services\V1\RemediationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RemediationController extends BaseController
{

    protected $remediationService;
    protected $logService;

    public function __construct(RemediationService $remediationService ,LogService $logService)
    {
        $this->logService = $logService;
        $this->remediationService=$remediationService;
    }
    /**
     * Display a listing of the resource.
     */
    // public function index():JsonResponse
    // {
    //     $remediations=$this->remediationService->getAllRemediationByExecution();

    //     if($remediations->isEmpty()){
    //         return $this->sendError("no remediations found",[]);
    //     }
    //     return $this->sendResponse(RemediationResource::collection($remediations),'remediations retrieved successfully');
    // }

    public function closeRemediation($id): JsonResponse
    {
        try {
            // Fermer la mission
            $remediation = $this->remediationService->closeRemediation($id);

            if (!$remediation) {
                return $this->sendError("remediation not found", [], 404);
            }

            // Log de l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'testeur',
                "Cloture de la remediation : {$remediation->description}",
                ""
            );

            // Réponse JSON
            return $this->sendResponse(new RemediationResource($remediation), "remediation closed successfully");
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
    }

    public function UpdateStatusRemediation($id): JsonResponse
    {
        try {
            // Fermer la mission
            $remediation = $this->remediationService->updateStatusRemediation($id);

            if (!$remediation) {
                return $this->sendError("remediation not found", [], 404);
            }

            // Log de l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'testeur',
                "update de la remediation : {$remediation->description}",
                ""
            );

            // Réponse JSON
            return $this->sendResponse(new RemediationResource($remediation), "remediation status updated successfully");
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
    }

    public function getRemediationStatusOptions()
    {
        try {
            $data = $this->remediationService->getRemediationStatusOptions();
            return $this->sendResponse($data, "remediation status options retrieved successfully", 200);
        } catch (\Exception $e) {
            return $this->sendError("Error while retrieving remediation status options", ['error' => $e->getMessage()], 500);
        }
    }
    public function getRemediationsByExecution($execution)
    {
        try {
            $data = $this->remediationService->getRemediationsByExecution($execution);
            return $this->sendResponse($data, "remediations  retrieved successfully", 200);
        } catch (\Exception $e) {
            return $this->sendError("Error while retrieving remediation status options", ['error' => $e->getMessage()], 500);
        }
    }
    public function getAllRemediationsByExecution($missionId,$systemId,$executionId):JsonResponse
    {
        try{
            $remediations=$this->remediationService->getAllRemediationsByExecution($executionId);
            if (!isset($remediations)) {
                return $this->sendError('Aucune remediation trouvé pour cette execution.', [], 404);
            }

           // return $this->sendResponse($remediations, 'Liste des remediations récupérée avec succès.');
            return $this->sendResponse(RemediationResource::collection($remediations), 'Liste des remediations récupérée avec succès.');

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des remediation.', ['error' => $e->getMessage()], 500);
        }
    }


    public function storeRemediationForExecution(Request $request, $missionId, $systemId, $executionId, $controlId):JsonResponse
    {
        try{
            $rules=[
                'description'=>'required|string|max:255',
                'owner_cntct'=>'required|email|max:255',
                'start_date'=>'required|date',
                'end_date' => 'required|date|after:start_date',
               // 'action_name'=>'required|string|max:255',
                //'follow_up'=>'sometimes|string|max:255',
            ];
            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("Validation failed",$validator->errors(),422);
            }

            $remediation=$this->remediationService->createRemediationForExecution(
                $validator->validate(),
                $executionId,
                $controlId
            );

            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'testeur',
                "Création d'une remediation  {$remediation->owner_cntct} pour execution ID {$executionId}",
                ""
            );
    
            return $this->sendResponse(
                new RemediationResource($remediation),
                "remediation créé  avec succès",
                201
            );
    
        }catch(\Exception $e)
        {
            return $this->sendError(
                "Erreur lors de la creation  remediation",
                ["error"=>$e->getMessage()],
                500
            );
        }
    }

    public function updateRemediation(Request $request,$missionId,$systemId, $id):JsonResponse
    {
        try{
            $rules=[
                'description'=>'sometimes|string|max:255',
                'owner_cntct'=>'sometimes|email|max:255',
                'follow_up'=>'sometimes|nullable|string|max:255',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
              //  'action_name'=>'sometimes|string|max:255',
            ];

            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("Validation failed",$validator->errors());
            }
            $validatedData =$validator->validated();

        //     // Convert empty strings to null
        // foreach ($validatedData as $key => $value) {
        //     if ($value === '') {
        //         $validatedData[$key] = null;
        //     }
        // }

            $remediation=$this->remediationService->updateRemediatio($id,$validatedData);

            if(!$remediation){
                return $this->sendError("remediation not found to update",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'testeur',
                "Modification du remediation: {$remediation->description}",
                " "
            );
            return $this->sendResponse(new RemediationResource($remediation),"remediation updated successfully");

        }catch(\Exception $e){
            return $this->sendError("An error occurred",$e->getMessage(),500);

        }
    }

 public function deleteRemediation($missionId,$systemId,$id):JsonResponse
 {
    try{
        $description=$this->remediationService->deleteRemediation($id);
        if(!$description){
            return $this->sendError("remediation not found",[],404);
        }
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'testeur',
            "Suppression  d'une remediation :{$description}",
            " "
        );    
        return $this->sendResponse(['success'=>true],"remediation deleted successfully");

    }catch(\Exception $e)
    {
        return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
    }
 }

 public function getRemediationInfo($remediationId){
    try
    {
        $remediation= $this->remediationService->getRemediationInfo($remediationId);
        if (!isset($remediation)) {
            return $this->sendError('Aucune remediation trouvé pour cette execution.', [], 404);
        }

     //   return $this->sendResponse($remediation, 'remediation récupérée avec succès.');
        return $this->sendResponse(new RemediationResource($remediation), 'remediation récupérée avec succès.');

    } catch (\Exception $e) {
        return $this->sendError('Erreur lors de la récupération de remediation.', ['error' => $e->getMessage()], 500);
    }
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
    public function show(Remediation $remediation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Remediation $remediation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Remediation $remediation)
    {
        //
    }
}
