<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Participation;
use Illuminate\Http\Request;
use App\Services\V1\ParticipationService;
use App\Services\V1\UserService;

class ParticipationController extends BaseController
{
   protected $participationService;
   
   public function __construct(ParticipationService $participationService )
   {
       $this->participationService = $participationService;
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
