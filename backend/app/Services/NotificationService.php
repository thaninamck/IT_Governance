<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\CustomNotification;
use Log;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    public function sendNotification($userId, $message, $url , $type )
    {
        $user = User::where('id', $userId)->first();
       ///dd($user);
        if ($user) {
            $data = [

                'message' => $message,
                'url' => $url,
                'type' => $type,
            ];
            $user->notify(new CustomNotification($data));
        }
    }


    public function markNotificationAsRead(string $notificationId)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }

    $notification = $user->notifications()->where('id', $notificationId)->first();

    if ($notification) {
        $notification->markAsRead();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    return response()->json(['message' => 'Notification non trouvée'], 404);
}


}
