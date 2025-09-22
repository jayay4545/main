<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StorageAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only add headers for storage routes
        if (str_starts_with($request->path(), 'storage/')) {
            $response->header('Access-Control-Allow-Origin', '*');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            $response->header('Cache-Control', 'public, max-age=3600');
        }

        return $response;
    }
}