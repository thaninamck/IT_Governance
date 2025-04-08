<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use App\Models\Participation;
use App\Services\LogService;
use App\Services\V1\ParticipationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParticipationController extends BaseController
{
    protected $participationService;
    protected $logService;

    public  function __construct(ParticipationService $participationService, LogService $logService)
    {
        $this->logService = $logService;
        $this->participationService = $participationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(){}


    
   

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $missionId): JsonResponse
    {

        try {

            $rules = [
                'members' => 'required|array',
                'members.*.user_id' => 'required|exists:users,id',
                'members.*.profile_id' => 'required|exists:profiles,id'
            ];
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("validation failed", $validator->errors(), 422);
            }

            $validatedData = $validator->validated();
            // Explicitly pass the members array
            $result = $this->participationService->addMembersToMission($missionId, $validatedData['members']);

            // Log l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Manager',
                "Members added to mission $missionId ",
                ""
            );

            return $this->sendResponse($result, 'Membres ajoutés avec succès.');
        } catch (\Exception $e) {

            return $this->sendError('Erreur lors de l\'ajout des membres.', [], 500);
        }
    }

    
    public function deleteParticipant($id): JsonResponse
    {
        try {
            $user_id = $this->participationService->deleteParticipationById($id);
            if (!$user_id) {
                return $this->sendError("client not found", [], 404);
            }
            // Log l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Manager',
                "suppression d'un membre : {$user_id}",
                ""
            );

            return $this->sendResponse(['success'=>true], 'Membre retiré avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la suppression du membre.', [$e->getMessage()], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Participation $participation)
    {
        //
    }

    public function getTestersByMissionID($missionId)
    {
        try{
            $testers=$this->participationService->getTestersByMissionID($missionId);
            if (!isset($testers)) {
                return $this->sendError('Aucun testeur trouvé pour cette mission.', [], 404);
            }

            return $this->sendResponse($testers, 'Liste des testeurs récupérée avec succès.');

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des testeurs.', ['error' => $e->getMessage()], 500);
        }
        
    }
    
}
