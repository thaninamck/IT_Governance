<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ClientResource;
use App\Models\Client;
use App\Services\V1\ClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends BaseController
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {

        $this->clientService=$clientService;
    }

     /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $clients=$this->clientService->getAllClients();

        if($clients->isEmpty()){
            return $this->sendError("no clients found",[]);
        }
        return $this->sendResponse(ClientResource::collection($clients),"clients retrived successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):JsonResponse
    {
        try{
            $rules=[
                'commercial_name'=> 'required|string|max:255',
                'social_reason'=>'required|string|max:255',
                'correspondence'=>'required|string|max:255',
                'address'=>'required|string|max:255',
                'contact_1'=>'nullable|string|max:255',
                'contact_2'=>'nullable|string|max:255',
            ];
            $validator =Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }

            $clientData=$validator->validated();

            $client=$this->clientService->createClient($clientData);

            $response=[
                'client' =>new ClientResource($client),
                'message'=>'client created successfully'
            ];
            return $this->sendResponse($response,"client created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    public function updateClient(Request $request, $id):JsonResponse
    {
        try{
            $rules=[
                'commercial_name'=> 'sometimes|string|max:255',
                'social_reason'=>'sometimes|string|max:255',
                'correspondence'=>'sometimes|string|max:255',
                'address'=>'sometimes|string|max:255',
                'contact_1'=>'sometimes|string|max:255',
                'contact_2'=>'sometimes|string|max:255',
            ];

            $validator=Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors());
            }
            $client=$this->clientService->updateClient($id,$validator->validated());

            if(!$client){
                return $this->sendError("client not found update",[],404);
            }
            return $this->sendResponse(new ClientResource($client),"client updated successfully");

        }catch(\Exception $e){
            return $this->sendError("An error occurred",$e->getMessage(),500);

        }
    }

    public function deleteClient($id):JsonResponse
    {
        try{
            $commercial_name =$this->clientService->deleteClient($id);
            if(!$commercial_name){
                return $this->sendError("client not found",[],404);
            }
            return $this->sendResponse(['success'=>true],"client deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }

    public function storeMultiple(Request $request):JsonResponse
    {
        $validClients=$request->input('clients',[]);
        try{
            if(!empty($validClients)){
                $clients=$this->clientService->createMultipleClients($validClients);

                return $this->sendResponse([
                    'success'=>true,
                    'message'=>'clients inserted successfully',
                    'inserted_clients'=>ClientResource::collection($clients),
                ],"clients was inserted successfully");
            }
            return $this->sendError("no clients to insert",[],422);
        }catch(\Exception $e){
            return $this->sendError("server error:".$e->getMessage(),[],500);
        }
    }

    
   

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
