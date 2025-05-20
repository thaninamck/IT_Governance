<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\SourceResource;
use App\Models\Source;
use App\Services\LogService;
use App\Services\V1\SourceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SourceController extends BaseController
{
    protected $sourceService;
    protected $logService;

    public function __construct(SourceService $sourceService ,LogService $logService)
    {
        $this->logService=$logService;
        $this->sourceService=$sourceService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $sources=$this->sourceService->getAllSources();

        if ($sources->isEmpty()){

            return $this->sendError("no sources found",[]);
        }
        return $this->sendResponse(SourceResource::collection($sources),"sources retrived successfully");
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

            $sourceData=$validator->validated();

            $source = $this->sourceService->createSource($sourceData['name']);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Admin',
                "Création d'une source {$source->name}",
                "" 
            );
            $response=[
                'source' =>new SourceResource($source),
                'message'=>'source created successfully'
            ];
            return $this->sendResponse($response,"source created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    public function deleteSource($id):JsonResponse
    {
        try{
            $name =$this->sourceService->deleteSource($id);
            if(!$name){
                return $this->sendError("source not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'une source:{$name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"source deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Source $source)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Source $source)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Source $source)
    {
        //
    }
}