<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\StatusResource;
use App\Models\Status;
use App\Services\LogService;
use App\Services\V1\StatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StatusController extends BaseController
{

    protected $statusService;
    protected $logService;

    public function __construct(StatusService $statusService ,LogService $logService)
    {
        $this->logService=$logService;
        $this->statusService=$statusService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $status=$this->statusService->getAllStatus();

        if ($status->isEmpty()){

            return $this->sendError("no sources found",[]);
        }
        return $this->sendResponse(StatusResource::collection($status),"status retrived successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) :JsonResponse
    {
        try{
            $rules = [
                'status_name' => 'required|string|max:255', 
                'entity' => 'required|string|max:255', 
            ];
    
            $validator =Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }

            $statusData=$validator->validated();

            $status = $this->statusService->createStatus($statusData['status_name'], $statusData['entity']);


            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Admin',
                "Création d'un status {$status->status_name}",
                "" 
            );
            $response=[
                'status' =>new StatusResource($status),
                'message'=>'status created successfully'
            ];
            return $this->sendResponse($response,"status created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }


    public function deleteStatus($id):JsonResponse
    {
        try{
            $status_name =$this->statusService->deleteStatus($id);
            if(!$status_name){
                return $this->sendError("status not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'un status:{$status_name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"status deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Status $status)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Status $status)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Status $status)
    {
        //
    }
}
