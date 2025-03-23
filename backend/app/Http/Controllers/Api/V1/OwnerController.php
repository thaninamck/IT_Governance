<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\OwnerResource;
use App\Models\Owner;
use App\Services\LogService;
use App\Services\V1\OwnerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OwnerController extends BaseController
{
    protected $ownerService;
    protected $logService;

    public function __construct(OwnerService $ownerService ,LogService $logService)
    {
        $this->logService = $logService;
        $this->ownerService=$ownerService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $owners=$this->ownerService->getAllOwners();

        if($owners->isEmpty()){
            return $this->sendError("no owners found",[]);
        }
        return $this->sendResponse(OwnerResource::collection($owners),'owners retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):JsonResponse
    {
        try{
            $rules=[
                'full_name'=>'required|string|max:255',
                'email'=>'required|string|max:255',
               
            ];
            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }
            $ownerData=$validator->validated();

            $owner=$this->ownerService->createOwner($ownerData);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Manager',
                "Création d'un owner {$owner->full_name}",
                "" 
            );
            $response=[
                'owner' =>new OwnerResource($owner),
                'message'=>'owner created successfully'
            ];
            return $this->sendResponse($response,"owner created successfully",201);
        
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Owner $owner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Owner $owner)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Owner $owner)
    {
        //
    }
}
