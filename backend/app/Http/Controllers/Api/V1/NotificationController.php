<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\NotificationService;
use App\Http\Resources\Api\V1\NotificationResource;
class NotificationController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    public function index(Request $request)
    {
        
            $notifications = $request->user()->notifications; // Récupère toutes les notifications de l'utilisateur
            return $this->sendResponse(
                NotificationResource::collection($notifications),
                'Notifications récupérées avec succès'
            );
        
    }



    public function simulate()
    {
        $user = auth()->user(); // Récupère l'utilisateur authentifié
    
        if (!$user) {
            return $this->sendError("Utilisateur non authentifié", [], 401);
        }
    
        // Instancier le service de notification
        $notificationService = app(\App\Services\NotificationService::class);
    
        // Simuler l'envoi de 3 notifications avec une URL sous forme d'un tableau
        $notificationService->sendNotification($user->id, "Nouvelle mission assignée", ['type' => 'mission', 'id' => 1], "mission");
        $notificationService->sendNotification($user->id, "Mise à jour de la mission", ['type' => 'mission', 'id' => 2], "update");
        $notificationService->sendNotification($user->id, "Rappel de réunion", ['type' => 'meeting', 'id' => 1], "reminder");
    
        return $this->sendResponse([], "Notifications test créées avec succès");
    }
    

    public function markNotificationAsRead($notificationId)
    {
        return $this->notificationService->markNotificationAsRead((string) $notificationId);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notification $notification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }
}
