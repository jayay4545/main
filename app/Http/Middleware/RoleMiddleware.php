<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        if (!$user->role) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User has no role assigned'
                ], 403);
            }
            return redirect()->route('dashboard')->with('error', 'User has no role assigned');
        }

        if (!in_array($user->role->name, $roles)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient permissions'
                ], 403);
            }
            return redirect()->route('dashboard')->with('error', 'Insufficient permissions');
        }

        return $next($request);
    }
}
