<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckNotGuest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role === 'guest') {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Guests are not allowed.'
                ], 403);
            }
            
            // For non-API routes, redirect to a page
            return redirect()->route('home')->with('error', 'Access denied. Guests are not allowed.');
        }

        return $next($request);
    }
}