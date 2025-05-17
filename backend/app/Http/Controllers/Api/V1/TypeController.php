<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\TypeResource;
use App\Models\Type;
use App\Services\LogService;
use App\Services\V1\TypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TypeController extends BaseController
{

    protected $typeService;
    protected $logService;
    
    public function __construct(TypeService $typeService ,LogService $logService)
    {
        $this->logService=$logService;
        $this->typeService=$typeService;
    }
    public function index():JsonResponse
    {
        $types=$this->typeService->getAllTypes();

        if ($types->isEmpty()){

            return $this->sendError("no type found",[]);
        }
        return $this->sendResponse(TypeResource::collection($types),"type retrived successfully");
    }

    public function store(Request $request):JsonResponse
    {
        try{
            $rules = [
                'name' => 'required|string|max:255', 
            ];
    
            $validator =Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }

            $typeData=$validator->validated();

            $type = $this->typeService->createType($typeData['name']);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Admin',
                "Création d'un type de controle {$type->name}",
                "" 
            );
            $response=[
                'type' =>new TypeResource($type),
                'message'=>'type created successfully'
            ];
            return $this->sendResponse($response,"type created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    public function deleteType($id):JsonResponse
    {
        try{
            $name =$this->typeService->deleteType($id);
            if(!$name){
                return $this->sendError("type not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'un type de control:{$name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"type deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Type $type)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Type $type)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Type $type)
    {
        //
    }
}
