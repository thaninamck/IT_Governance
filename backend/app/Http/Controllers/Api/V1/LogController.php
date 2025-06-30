<?php
namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\File;
use Log;

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
    
        foreach ($logLines as $index => $line) {
            // Nettoyer la ligne (enlever tout avant local.INFO:)
            $cleanLine = trim(\Illuminate\Support\Str::after($line, 'local.INFO:'));
            // Enlever le crochet restant au début
            $cleanLine = preg_replace('/^\[.*?\]\s*/', '', $cleanLine);
    
            $parts = explode('|', $cleanLine);
            $data = [];
    
            foreach ($parts as $part) {
                $keyValue = explode(':', $part, 2);
                if (count($keyValue) === 2) {
                    $key = strtolower(trim($keyValue[0]));
                    $value = trim($keyValue[1]);
                    $data[$key] = $value;
                }
            }
    
            if (!empty($data)) {
                $formattedLogs[] = [
                    'id' => $index,
                    'date_heure' => $data['date_heure'] ?? '',
                    'utilisateur' => $data['utilisateur'] ?? 'Unknown',
                    'ip' => $data['ip'] ?? '',
                    'profile' => $data['profile'] ?? '',
                    'action' => $data['action'] ?? '',
                    'mission' => $data['mission'] ?? '',
                ];
            }
        }
    
        return $this->sendResponse($formattedLogs, 'Logs récupérés avec succès.');
    }
    
    
    
}