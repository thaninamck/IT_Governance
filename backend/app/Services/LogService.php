<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class LogService
{
    // public static function logUserAction($user, $profile, $action, $mission)
    // {
    //     $logMessage = sprintf(
    //         "[%s] Date_Heure: %s | Utilisateur: %s | IP: %s | Profile: %s | Action: %s | Mission: %s",
    //         now()->toDateTimeString(),
    //         now()->format('Y-m-d H:i:s'),
    //         $user,
    //         Request::ip(),
    //         $profile,
    //         $action,
    //         $mission
    //     );

    //     Log::channel('user_activity')->info($logMessage);
    // }

    public static function logUserAction($user, $profile, $action, $mission)
    {
        $macAddress = self::getMacAddress();

        $logMessage = sprintf(
            "[%s] Date_Heure: %s | Utilisateur: %s | IP: %s | MAC: %s | Profile: %s | Action: %s | Mission: %s",
            now()->toDateTimeString(),
            now()->format('Y-m-d H:i:s'),
            $user,
            Request::ip(),
            $macAddress,
            $profile,
            $action,
            $mission
        );

        Log::channel('user_activity')->info($logMessage);
    }

    private static function getMacAddress()
    {
        $ipAddress = Request::ip();

        if (PHP_OS_FAMILY === 'Windows') {
            $output = shell_exec("getmac");
            preg_match('/([a-fA-F0-9-]{17})/', $output, $matches);
        } else {
            $output = shell_exec("arp -n " . escapeshellarg($ipAddress));
            preg_match('/([a-fA-F0-9:]{17})/', $output, $matches);
        }

        return $matches[1] ?? 'Unknown';
    }
}
