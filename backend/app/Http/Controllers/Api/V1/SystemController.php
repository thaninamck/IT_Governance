<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SystemResource;
use App\Models\System;
use App\Services\LogService;
use App\Services\V1\SystemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SystemController extends BaseController
{
    protected $systemService;
    protected $logService;

    public function __construct(SystemService $systemService ,LogService $logService)
    {
        $this->logService = $logService;
        $this->systemService=$systemService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $systems=$this->systemService->getAllSystems();

        if($systems->isEmpty()){
            return $this->sendError("no systems found",[]);
        }
        return $this->sendResponse(SystemResource::collection($systems),'systems retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):JsonResponse
    {
        try{
            $rules=[
                'name'=>'required|string|max:255',
                'description'=>'required|string|max:255',
                //'owner_id'=>'required|string|max:255',
                'full_name' => 'required|string|max:255', // Ajout du champ owner_full_name
                'email' => 'required|email|max:255',
            ];
            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }
            $systemData=$validator->validated();

            $system=$this->systemService->createSystem($systemData);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Manager',
                "Création d'un system {$system->name}",
                "" 
            );
            $response=[
                'system' =>new SystemResource($system),
                'message'=>'system created successfully'
            ];
            return $this->sendResponse($response,"system created successfully",201);
        
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }


    public function updateSystem(Request $request,$id):JsonResponse
    {
        try{
            $rules=[
                'name'=>'sometimes|string|max:255',
                'description'=>'sometimes|string|max:255',
                //'owner_id'=>'sometimes|string|max:255',
                'full_name' => 'sometimes|string|max:255', // Champ pour le propriétaire
                'email' => 'sometimes|email|max:255',
            ];
            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors());
            }
            $validatedData = $validator->validated();
            $system=$this->systemService->updateSystem($id, $validatedData);

            if(!$system){
                return $this->sendError("system not found update",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Manager',
                "Modification du system: {$system->name}",
                " "
            );
            return $this->sendResponse(new SystemResource($system),"system updated successfully");

        }catch(\Exception $e){
            return $this->sendError("An error occurred",$e->getMessage(),500);

        }
    }

    public function deleteSystem($id):JsonResponse
    {
        try{
            $name =$this->systemService->deleteSystem($id);
            if(!$name){
                return $this->sendError("system not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Manager',
                "Suppression  d'un system:{$name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"system deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(System $system)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, System $system)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(System $system)
    {
        //
    }
}
