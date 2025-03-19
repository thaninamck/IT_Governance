<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MissionResource;
use App\Models\Mission;
use App\Models\Participation;
use App\Repositories\V1\MissionRepository;
use App\Services\LogService;
use App\Services\V1\MissionService;
use App\Services\V1\ParticipationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\NotificationService;
class MissionController extends BaseController
{
    protected $missionService;
    protected $logService;
    protected $participationService;
    protected  $notificationService;

    
    public function __construct(MissionService $missionService, LogService $logService, ParticipationService $participationService,NotificationService $notificationService)
    {
        $this->missionService = $missionService;
        $this->logService = $logService;
        $this->participationService = $participationService;
        $this->notificationService = $notificationService;
    }


    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $missions = $this->missionService->getAllMissions();

        if ($missions->isEmpty()) {
            return $this->sendError('no missions found', []);
        }
        return $this->sendResponse(MissionResource::collection($missions), 'missions retrived successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Règles de validation
            $rules = [
                'mission_name' => 'required|string|max:255',
                'client_id' => 'required|integer|exists:clients,id', // Vérifie que le client existe
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date', // end_date doit être après start_date
                'manager_id' => 'required|integer|exists:users,id', // Vérifie que le manager existe
            ];

            // Validation des données
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors(), 422);
            }

            // Données validées
            $missionData = $validator->validated();
            $missionData['status_id'] = 9; // Définir le statut par défaut

            // Création de la mission
            $mission = $this->missionService->createMission($missionData);

            // Données pour la participation du manager
            $participantData = [
                'user_id' => $missionData['manager_id'],
                'mission_id' => $mission->id,
                'profile_id' => 3, // ID du profil "manager"
            ];

            // Création de la participation du manager
            $this->participationService->createParticipation($participantData);
            
           /*do this 
           
           $this->notificationService->sendNotification(
                $missionData['manager_id'],
                "Vous avez été affecté à la mission '{$mission->mission_name}' comme manager.",
                [
                    'type' => 'mission',
                    'id' => $mission->id
                ],
                'mission'
            );*/
                            
            // Log de l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Création d'une mission : {$mission->mission_name}",
                ""
            );

            // Réponse JSON
            $response = [
                'mission' => new MissionResource($mission),
                'message' => 'Mission créée avec succès',
            ];

            return $this->sendResponse($response, 'misssion created successfully', 201);
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
    }

    public function updateMission(Request $request, $id): JsonResponse
    {
        try {
            $rules = [
                'status_id' => 'sometimes|integer',
                'mission_name' => 'sometimes|string|max:255',
                'client_id' => 'sometimes|integer|exists:clients,id',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
                'manager_id' => 'sometimes|integer|exists:users,id',
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors());
            }

            $mission = $this->missionService->updateMission($id, $validator->validated());

            if (!$mission) {
                return $this->sendError("mission not found", [], 404);
            }

            // Mettre à jour le participant (manager) si manager_id est fourni
            if ($request->has('manager_id')) {
                $participantData = [
                    'user_id' => $request->input('manager_id'),
                    'profile_id' => 3, // ID du profil "manager"
                ];


                // Trouver la participation existante pour cette mission et ce profil
                $participation = $this->participationService->findParticipationByMissionAndProfile(
                    $mission->id,
                    3 // ID du profil "manager"
                );
                $this->participationService->updateParticipation($participation->id, $participantData);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Modification de la mission: {$mission->mission_name}",
                " "
            );
            return $this->sendResponse(new MissionResource($mission), "mission updated successfully");
        } catch (\Exception $e) {
            return  $this->sendError("An error occurred", $e->getMessage(), 500);
        }
    }

    public function deleteMission($id): JsonResponse
    {
        try {
            $mission_name = $this->missionService->deleteMission($id);

            if (!$mission_name) {
                return $this->sendError("mission non trouvé", [], 404);
            }

            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'une mission:{$mission_name}",
                " "
            );
            return $this->sendResponse(['success' => true], "mission supprimé avec succès");
        } catch (\Exception $e) {
            return $this->sendError("Une erreur est survenue", ['error' => $e->getMessage()], 500);
        }
    }

    // public function storeMultiple(Request $request): JsonResponse
    // {
    //     $validMissions = $request->input('missions', []);
    //     try {
    //         if (!empty($validMissions)) {

    //             $missions = $this->missionService->createMultipleMissions($validMissions);

    //             // Créer les participants pour chaque mission
    //             foreach ($missions as $mission) {

    //                 \Log::info("Mission data:", [
    //                     'mission_id' => $mission->id,
    //                     'manager_id' => $mission->manager_id,
    //                 ]);
    //                 $participantData = [
    //                     'user_id' => $mission->manager_id,
    //                     'mission_id' => $mission->id,
    //                     'profile_id' => 3, // ID du profil "manager"
    //                 ];

    //                 \Log::info("Participant data:", $participantData);

    //                 // Création de la participation du manager
    //                 $this->participationService->createParticipation($participantData);
    //             }

    //             $this->logService->logUserAction(
    //                 auth()->user()->email ?? 'Unknown',
    //                 'Admin',
    //                 "Insertion des missions",
    //                 " "
    //             );
    //             return $this->sendResponse([
    //                 'success' => true,
    //                 'message' => 'missions inserted successfully',
    //                 'inserted_missions' => MissionResource::collection($missions),
    //             ], "missions were inserted successfully");
    //         }
    //         return $this->sendError("No missions to insert", [], 422);
    //     } catch (\Exception $e) {
    //         // Attraper les erreurs et les envoyer avec un message détaillé
    //         return $this->sendError("Server error: " . $e->getMessage(), [], 500);
    //     }
    // }


    public function storeMultiple(Request $request): JsonResponse
{
    $validMissions = $request->input('missions', []);

    try {
        if (!empty($validMissions)) {
            $insertedMissions = [];

            // Valider et créer chaque mission
            foreach ($validMissions as $missionData) {
                // Règles de validation pour chaque mission
                $rules = [
                    'mission_name' => 'required|string|max:255',
                    'client_id' => 'required|integer|exists:clients,id',
                    'start_date' => 'required|date',
                    'end_date' => 'nullable|date|after:start_date',
                    'manager_id' => 'required|integer|exists:users,id', // Vérifie que le manager existe
                ];

                // Validation des données de la mission
                $validator = Validator::make($missionData, $rules);

                if ($validator->fails()) {
                    return $this->sendError("Validation failed for a mission", $validator->errors(), 422);
                }

                // Données validées
                $validatedData = $validator->validated();
                $validatedData['status_id'] = 9; // Définir le statut par défaut

                // Création de la mission
                $mission = $this->missionService->createMission($validatedData);

                // Données pour la participation du manager
                $participantData = [
                    'user_id' => $validatedData['manager_id'], // Utiliser le manager_id validé
                    'mission_id' => $mission->id,
                    'profile_id' => 3, // ID du profil "manager"
                ];

                // Création de la participation du manager
                $this->participationService->createParticipation($participantData);

                // Ajouter la mission créée à la liste
                $insertedMissions[] = $mission;
            }

            // Log de l'action
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Insertion des missions",
                ""
            );

            // Réponse JSON
            return $this->sendResponse([
                'success' => true,
                'message' => 'missions inserted successfully',
                'inserted_missions' => MissionResource::collection($insertedMissions),
            ], "missions were inserted successfully");
        }

        return $this->sendError("No missions to insert", [], 422);
    } catch (\Exception $e) {
        // Attraper les erreurs et les envoyer avec un message détaillé
        return $this->sendError("Server error: " . $e->getMessage(), [], 500);
    }
}

public function closeMission($id): JsonResponse
{
    try {
        // Fermer la mission
        $mission = $this->missionService->closeMission($id);

        if (!$mission) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "Cloture de la mission : {$mission->mission_name}",
            ""
        );

        // Réponse JSON
        return $this->sendResponse(new MissionResource($mission), "Mission closed successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}

public function archiveMission($id): JsonResponse
{
    try {
        // Fermer la mission
        $mission = $this->missionService->archiveMission($id);

        if (!$mission) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "archivé de la mission : {$mission->mission_name}",
            ""
        );

        // Réponse JSON
        return $this->sendResponse(new MissionResource($mission), "Mission archived successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}

public function getArchivedMissions(): JsonResponse
{
    try {
        // Récupérer les missions archivées
        $missions = $this->missionService->getArchivedMissions();

        if ($missions->isEmpty()) {
            return $this->sendError("No archived missions found", []);
        }

        // Réponse JSON
        return $this->sendResponse(MissionResource::collection($missions), "Archived missions retrieved successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}


public function cancelMission($id): JsonResponse
{
    try {
        // Fermer la mission
        $mission = $this->missionService->cancelMission($id);

        if (!$mission) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "annulé  la mission : {$mission->mission_name}",
            ""
        );

        // Réponse JSON
        return $this->sendResponse(new MissionResource($mission), "Mission archived successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}
public function stopMission($id): JsonResponse
{
    try {
        // Fermer la mission
        $mission = $this->missionService->stopMission($id);

        if (!$mission) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "stop de la mission : {$mission->mission_name}",
            ""
        );

        // Réponse JSON
        return $this->sendResponse(new MissionResource($mission), "Mission archived successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}

public function resumeMission(Request $request, $id): JsonResponse
{
    try {
        // Récupérer le statut précédent depuis la requête
        $previousStatusId = $request->input('previous_status_id');

        if (!$previousStatusId) {
            return $this->sendError("Previous status ID is required", [], 400);
        }

        // Reprendre la mission
        $mission = $this->missionService->resumeMission($id, $previousStatusId);

        if (!$mission) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "Reprise de la mission : {$mission->mission_name}",
            ""
        );

        // Réponse JSON
        return $this->sendResponse(new MissionResource($mission), "Mission resumed successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
}
    /**
     * Display the specified resource.
     */
    public function show(Mission $mission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mission $mission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mission $mission)
    {
        //
    }
}
