<?php
namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;

class LogController extends BaseController
{
    public function getUserActivityLogs()
    {
        $logFile = storage_path('logs/user_activity.log');

        if (!File::exists($logFile)) {
            return $this->sendError('Aucun log trouvé.', [], 404);
        }

        $logs = File::get($logFile);
        $logLines = explode("\n", trim($logs));

        $formattedLogs = [];

        foreach ($logLines as $index => $line) { // Ajoute un index unique
            preg_match('/\[(.*?)\] Date_Heure: (.*?) \| Utilisateur: (.*?) \| IP: (.*?) \| MAC: (.*?) \| Profile: (.*?) \| Action: (.*?) \| Mission: (.*)/', $line, $matches);

            if (count($matches) === 9) { // Mise à jour pour inclure MAC
                $formattedLogs[] = [
                    'id' => $index,  
                    'timestamp' => $matches[1],
                    'date_heure' => $matches[2],
                    'utilisateur' => $matches[3],
                    'ip' => $matches[4],
                    'mac' => $matches[5],  // Ajout de l'adresse MAC
                    'profile' => $matches[6],
                    'action' => $matches[7],
                    'mission' => $matches[8],
                ];
            }
        }

        return $this->sendResponse($formattedLogs, 'Logs récupérés avec succès.');
    }
}