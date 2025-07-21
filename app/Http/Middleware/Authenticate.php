<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request)
    {
        // For API requests, don't redirect - return null
        // This will cause the middleware to return a 401 JSON response instead of redirecting
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // For web requests, you would redirect to a login page
        // Since this is an API-focused app, we'll return null for now
        return null;
    }

    /**
     * Handle an unauthenticated user - override to return proper JSON for API
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'message' => 'Unauthenticated. Please log in.',
                'error' => 'Authentication required'
            ], 401));
        }

        return parent::unauthenticated($request, $guards);
    }
}