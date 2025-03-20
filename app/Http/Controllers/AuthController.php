<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    //Register metoda
    public function register(Request $request)
{
    try {
        Log::info('Registration attempt', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        Log::info('Validation passed');
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        
        Log::info('User created', ['user_id' => $user->id]);
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    } catch (\Exception $e) {
        Log::error('Registration failed', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Registration failed',
            'message' => $e->getMessage()
        ], 500);
    }
}

    //Login metoda
    public function login(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ], 200);
}

    //Log-Out metoda
    public function logout(Request $request)
{
    $request->user()->tokens()->delete();

    return response()->json([
        'message' => 'Logged out successfully',
    ], 200);
}

}

