<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\LogService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Api\V1\ControlResource;

use Illuminate\Support\Facades\Validator;
use App\Services\V1\ControlService;

class ControlController extends BaseController
{
    protected $controlService;
    protected $logService;

    public function __construct(ControlService $controlService, LogService $logService)
    {
        $this->controlService = $controlService;
        $this->logService = $logService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $controls = $this->controlService->getAllControls();

        if ($controls->isEmpty()) {
            return $this->sendError("No controls found", []);
        }

        return $this->sendResponse(ControlResource::collection($controls), "Controls retrieved successfully");
    }

    public function archiveControl($id)
    {
        $success = $this->controlService->archiveControl($id);
    
        if (!$success) {
            return $this->sendError("Erreur lors de l'archivage du control", []);
        }
    
        return $this->sendResponse(["Control archivé avec succès"], "Control archivé avec succès");
    }
    public function restoreControl($id)
    {
        $success = $this->controlService->restoreControl($id);
    
        if (!$success) {
            return $this->sendError("Erreur lors de restore du control", []);
        }
    
        return $this->sendResponse(["Control restauré avec succès"], "Control archivé avec succès");
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
{
    try {
        $rules = [
            'description' => 'nullable|string',
            'code' => 'required|string|max:255',
            'test_script' => 'nullable|string', 
            'type' => 'nullable|array', 
            'type.id' => 'nullable|exists:types,id', 
            'type.name' => 'nullable|string|max:255',
            'majorProcess' => 'nullable|array',
            'majorProcess.id' => 'nullable|exists:major_processes,id',
            'majorProcess.code' => 'nullable|string|max:255',
            'majorProcess.description' => 'nullable|string',
            'subProcess' => 'nullable|array',
            'subProcess.id' => 'nullable|exists:sub_processes,id',
            'subProcess.code' => 'nullable|string|max:255',
            'subProcess.name' => 'nullable|string|max:255',
            'sources' => 'nullable|array',
            'sources.*.id' => 'exists:sources,id',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation failed", $validator->errors(), 422);
        }

        $controlData = $validator->validated();

        $control = $this->controlService->createControl($controlData);

        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "Création d'un contrôle: {$control->code}",
            " "
        );

        return $this->sendResponse(new ControlResource($control), "Control created successfully", 201);
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}


    /**
     * Say Hello (Test Function)
     */
    public function sayHello(): JsonResponse
    {
        return response()->json(['message' => 'Hello World!']);
    }



    public function update(Request $request, $id)
    { try {
        $validatedData = $request->validate([
            'description' => 'nullable|string',
            'code' => 'nullable|string',
            'testScript' => 'nullable|string',
            'type' => 'nullable|array', // [id, "Nom du type"]
            'majorProcess' => 'nullable|string',
            'majorProcessCode' => 'nullable|string',
            'subProcess' => 'nullable|string',
            'subProcessCode' => 'nullable|string',
            'sources' => 'nullable|array', // [[id, "Nom de la source"], ...]
        ]);

        $control = $this->controlService->updateControl((int) $id, $validatedData);
       // $control = (int) $id;
        $result=[
            'message' => 'Contrôle mis à jour avec succès',
            'control' => $control
        ];
        return $this->sendResponse( $result, "Control updated successfully");

    } catch (\Throwable $th) {
        return $this->sendError("", ["error"=> $th->getMessage()]);
    }
       
    }



    public function multipleStore(Request $request): JsonResponse
{
    try {
        $rules = [
            'controls' => 'required|array|min:1',
            'controls.*.description' => 'nullable|string',
            'controls.*.code' => 'required|string|max:255',
            'controls.*.test_script' => 'nullable|string', 
            'controls.*.type' => 'nullable|array', 
            'controls.*.type.id' => 'nullable|exists:types,id', 
            'controls.*.type.name' => 'nullable|string|max:255',
            'controls.*.majorProcess' => 'nullable|array',
            'controls.*.majorProcess.id' => 'nullable|exists:major_processes,id',
            'controls.*.majorProcess.code' => 'nullable|string|max:255',
            'controls.*.majorProcess.description' => 'nullable|string',
            'controls.*.subProcess' => 'nullable|array',
            'controls.*.subProcess.id' => 'nullable|exists:sub_processes,id',
            'controls.*.subProcess.code' => 'nullable|string|max:255',
            'controls.*.subProcess.name' => 'nullable|string|max:255',
            'controls.*.sources' => 'nullable|array',
            'controls.*.sources.*.id' => 'exists:sources,id',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation failed", $validator->errors(), 422);
        }

        $controlsData = $validator->validated()['controls'];

        $createdControls = [];
        foreach ($controlsData as $controlData) {
            $createdControls[] = new ControlResource($this->controlService->createControl($controlData));

            // Enregistrement des logs
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Création d'un contrôle: {$controlData['code']}",
                " "
            );
        }

        return $this->sendResponse($createdControls, "Multiple controls created successfully", 201);
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}


public function deleteControl($id){
    if(!$this->controlService->deleteControl($id)){
        return $this->sendError("Erreur lors de la suppression du contrôle", []);
    }
    return $this->sendResponse(["controle supprimé avec succées" ],"controle supprimé ");
}
}
