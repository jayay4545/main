<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class PublicStorageAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only process storage routes
        if (str_starts_with($request->path(), 'storage/')) {
            // Allow cross-origin requests
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
            
            // Add caching headers
            $response->headers->set('Cache-Control', 'public, max-age=3600');
            
            // Set content type based on file extension
            $path = $request->path();
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];
            
            if (isset($mimeTypes[$extension])) {
                $response->headers->set('Content-Type', $mimeTypes[$extension]);
            }
        }

        return $response;
    }
}