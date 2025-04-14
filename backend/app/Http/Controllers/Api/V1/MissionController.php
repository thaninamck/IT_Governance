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

use function Laravel\Prompts\text;

class MissionController extends BaseController
{
    protected $missionService;
    protected $logService;
    protected $participationService;
    protected $notificationService;


    public function __construct(MissionService $missionService, LogService $logService, ParticipationService $participationService, NotificationService $notificationService)
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
                'manager_id' => 'required|integer|exists:users,id', // Vérifie que le manager existe
                'audit_start_date' => 'required|date',
                'audit_end_date' => 'required|date|after:audit_start_date',
                'start_date' => 'required|date|after:audit_end_date',
                'end_date' => 'required|date|after:start_date', // end_date doit être après start_date
            ];

            // Validation des données
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors(), 422);
            }

            // Données validées
            $missionData = $validator->validated();
            $missionData['status_id'] = 10; // Définir le statut par défaut non commencée

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
     json_encode(['type' => 'mission', 'id' => $mission->id]), // Convertir en JSON
     'mission'
 );
 */

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
                'audit_start_date' => 'sometimes|date',
                'audit_end_date' => 'sometimes|date|after:audit_start_date',
                'start_date' => 'sometimes|date|after:audit_end_date',
                'end_date' => 'sometimes|date|after:start_date', // end_date doit être après start_date
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
            // Récupérer la mission avec les relations après mise à jour
        $mission = Mission::with(['client', 'status', 'participations.user'])->find($mission->id);
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Modification de la mission: {$mission->mission_name}",
                " "
            );
            return $this->sendResponse(new MissionResource($mission), "mission updated successfully");
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", $e->getMessage(), 500);
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
                    $validatedData['status_id'] = 10; // Définir le statut par défaut NOn commencée

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
   

// public function stopMission($id): JsonResponse
// {
//     try {
//         // Fermer la mission
//         $mission = $this->missionService->stopMission($id);

//         if (!$mission) {
//             return $this->sendError("Mission not found", [], 404);
//         }

//         // Log de l'action
//         $this->logService->logUserAction(
//             auth()->user()->email ?? 'Unknown',
//             'Admin',
//             "stop de la mission : {$mission->mission_name}",
//             ""
//         );

//         // Réponse JSON
//         return $this->sendResponse(new MissionResource($mission), "Mission archived successfully");
//     } catch (\Exception $e) {
//         return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
//     }
// }

 public function stopMission($id): JsonResponse
 {
    try {
        // Mettre la mission en pause
        $result = $this->missionService->stopMission($id);

        if (!$result['mission']) {
            return $this->sendError("Mission not found", [], 404);
        }

        // Log de l'action
        $this->logService->logUserAction(
            auth()->user()->email ?? 'Unknown',
            'Admin',
            "Mise en pause de la mission : {$result['mission']->mission_name}",
            ""
        );

        // Réponse JSON avec le statut précédent
        return $this->sendResponse([
            'mission' => new MissionResource($result['mission']),
            'previous_status_id' => $result['previous_status_id'],
        ], "Mission paused successfully");
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
    }
 }

// public function resumeMission(Request $request, $id): JsonResponse
// {
//     try {
//         // Récupérer le statut précédent depuis la requête
//         $previousStatusId = $request->input('previous_status_id');

//         if (!$previousStatusId) {
//             return $this->sendError("Previous status ID is required", [], 400);
//         }

//         // Reprendre la mission
//         $mission = $this->missionService->resumeMission($id, $previousStatusId);

//         if (!$mission) {
//             return $this->sendError("Mission not found", [], 404);
//         }

//         // Log de l'action
//         $this->logService->logUserAction(
//             auth()->user()->email ?? 'Unknown',
//             'Admin',
//             "Reprise de la mission : {$mission->mission_name}",
//             ""
//         );

//         // Réponse JSON
//         return $this->sendResponse(new MissionResource($mission), "Mission resumed successfully");
//     } catch (\Exception $e) {
//         return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
//     }
// }

public function resumeMission(Request $request, $id): JsonResponse
 {
    try {
        // Récupérer le statut précédent et la nouvelle date de début depuis la requête
        $previousStatusId = $request->input('previous_status_id');
        $newStartDate = $request->input('new_start_date');

        if (!$previousStatusId || !$newStartDate) {
            return $this->sendError("Previous status ID and new start date are required", [], 400);
        }

        // Reprendre la mission
        $mission = $this->missionService->resumeMission($id, $previousStatusId, $newStartDate);

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
    public function getMembersByMission($missionId)
    {
        try {
            $members = $this->missionService->getMembersByMission($missionId);

            if (!isset($members)) {
                return $this->sendError('Aucun membre trouvé pour cette mission.', [], 404);
            }

            return $this->sendResponse($members, 'Liste des membres récupérée avec succès.');

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des membres.', ['error' => $e->getMessage()], 500);
        }
    }

    public function getSystemsByMissionID($missionId):JsonResponse
    {
        try{
            $systems=$this->missionService->getSystemsByMissionID($missionId);

            if (!isset($systems)) {
                return $this->sendError('Aucun system trouvé pour cette mission.', [], 404);
            }

            return $this->sendResponse($systems, 'Liste des systems récupérée avec succès.');

        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des systems.', ['error' => $e->getMessage()], 500);
        }
        
    }


//     public function getUserMissions(Request $request)
// {
//     $user = $request->user(); // Utilisateur authentifié
    
//     $missions = Mission::with(['client', 'status'])
//         ->whereHas('participations', function($query) use ($user) {
//             $query->where('user_id', $user->id);
//         })
//         ->get();

//     return response()->json($missions);
// }

// public function getUserMissions(Request $request)
// {
//     $user = $request->user();
    
//     $missions = Mission::with([
//         'client:id,name', // Seulement l'id et le nom du client
//         'status:id,name', // Seulement l'id et le nom du statut
//         'participations.user:id,name,role' // Seulement l'id, name et role des utilisateurs participants
//     ])
//     ->whereHas('participations', function($query) use ($user) {
//         $query->where('user_id', $user->id);
//     })
//     ->get([
//         'id as missionId',
//         'mission_name as missionName',
//         'client_id',
//         'start_date',
//         'end_date',
//         'audit_start_date as startAuditDate',
//         'audit_end_date as endAuditDate',
//         'status_id'
//     ]);

//     return response()->json(
//         $missions->map(function ($mission) use ($user) {
//             return [
//                 'missionId' => $mission->missionId,
//                 'missionName' => $mission->missionName,
//                 'clientId' => $mission->client_id,
//                 'clientName' => $mission->client->name,
//                 'startDate' => $mission->start_date,
//                 'endDate' => $mission->end_date,
//                 'startAuditDate' => $mission->startAuditDate,
//                 'endAuditDate' => $mission->endAuditDate,
//                 'status' => $mission->status->name,
//                 'statusId' => $mission->status_id,
//                 'userId' => $user->id,
//                 'userName' => $user->name,
//                 'userRole' => $user->role
//             ];
//         })
//     );
// }


public function getUserMissions(Request $request)
{
    $userId = $request->user()->id;
    $missions = $this->missionService->getUserMissions($userId);
    
    return response()->json($missions);
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

