<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
class CheckPasswordReset
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {   
        $user = $request->user();

        if ($user && $user->must_change_password) {
            return response()->json([
                'success' => false,
                'must_change_password' => true,
                'message' => 'You must change your password before accessing the application.'
            ], 403);
        }

        return $next($request);
    }


   
    
}
