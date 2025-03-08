<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class LogService
{
    public static function logUserAction($user, $profile, $action, $mission)
    {
        $logMessage = sprintf(
            "[%s] Date_Heure: %s | Utilisateur: %s | IP: %s | Profile: %s | Action: %s | Mission: %s",
            now()->toDateTimeString(),
            now()->format('Y-m-d H:i:s'),
            $user,
            Request::ip(),
            $profile,
            $action,
            $mission
        );

        Log::channel('user_activity')->info($logMessage);
    }
}
