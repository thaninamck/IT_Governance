<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Log;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Participation;
use App\Models\User;

class ManagerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        Log::info("Utilisateur authentifié", [$user]);

        $missionId = $request->route('mission'); 
        Log::info("Mission ID", [$missionId]);

        $isManager = Participation::where('user_id', $user->id)
            ->where('mission_id', $missionId)
            ->whereHas('profile', function ($query) {
                $query->where('profile_name', 'manager');
            })->exists();

        $isAdmin = $user->role === 1; 

        if (!$isManager && !$isAdmin) { 
            return response()->json(['error' => 'Accès refusé. Vous devez être manager ou admin.'], 403);
        }

        return $next($request);
    }
}
