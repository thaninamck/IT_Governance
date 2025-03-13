<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\LayerResource;
use App\Models\Layer;
use App\Services\LogService;
use App\Services\V1\LayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LayerController extends BaseController
{
    protected $layerService;
    protected $logService;

    public function __construct(LayerService $layerService ,LogService $logService)
    {
        $this->logService=$logService;
        $this->layerService=$layerService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $layers=$this->layerService->getAllLayers();

        if ($layers->isEmpty()){

            return $this->sendError("no layer found",[]);
        }
        return $this->sendResponse(LayerResource::collection($layers),"layers retrived successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
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

            $layerData=$validator->validated();

            $layer = $this->layerService->createLayer($layerData['name']);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Admin',
                "Création d'une couche {$layer->name}",
                "" 
            );
            $response=[
                'layer' =>new LayerResource($layer),
                'message'=>'layer created successfully'
            ];
            return $this->sendResponse($response,"layer created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    public function deleteLayer($id):JsonResponse
    {
        try{
            $name =$this->layerService->deleteLayer($id);
            if(!$name){
                return $this->sendError("layer not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'une couche:{$name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"layer deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Layer $layer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Layer $layer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Layer $layer)
    {
        //
    }
}
