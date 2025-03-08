<?php
namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;

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

        foreach ($logLines as $line) {
            preg_match('/\[(.*?)\] Date_Heure: (.*?) \| Utilisateur: (.*?) \| IP: (.*?) \| Profile: (.*?) \| Action: (.*?) \| Mission: (.*)/', $line, $matches);

            if (count($matches) === 8) {
                $formattedLogs[] = [
                    'timestamp' => $matches[1],
                    'date_heure' => $matches[2],
                    'utilisateur' => $matches[3],
                    'ip' => $matches[4],
                    'profile' => $matches[5],
                    'action' => $matches[6],
                    'mission' => $matches[7],
                ];
            }
        }

        return $this->sendResponse($formattedLogs, 'Logs récupérés avec succès.');
    }
}

