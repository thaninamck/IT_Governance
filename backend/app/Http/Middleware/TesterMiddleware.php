<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Participation;
class TesterMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        $missionId = $request->route('mission'); 

        $isManager = Participation::where('user_id', $user->id)
            ->where('mission_id', $missionId)
            ->whereHas('profile', function ($query) {
                $query->where('profile_name', 'testeur');
            })->exists();

        if (!$isManager) {
            return response()->json(['error' => 'Accès refusé. Vous devez être testeur.'], 403);
        }

        return $next($request);
    }
}
