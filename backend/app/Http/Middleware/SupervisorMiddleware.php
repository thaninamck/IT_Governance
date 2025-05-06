<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Participation;
use Illuminate\Support\Facades\Log;

class SupervisorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        Log::info("utilisateur recupere",[$user]);
        $missionId = $request->route('mission'); 
        Log::info("la mission",[$missionId]);
        $isManager = Participation::where('user_id', $user->id)
            ->where('mission_id', $missionId)
            ->whereHas('profile', function ($query) {
                $query->where('profile_name', 'manager');
            })->exists();

        $isSupervisor = Participation::where('user_id', $user->id)
            ->where('mission_id', $missionId)
            ->whereHas('profile', function ($query) {
                $query->where('profile_name', 'superviseur');
            })->exists();

        $isAdmin = $user->role === 1; 

        if (!$isSupervisor && !$isManager && !$isAdmin) {
            return response()->json(['error' => 'Accès refusé. Vous devez être superviseur, manager ou admin.'], 403);
        }

        return $next($request);
    }
}
