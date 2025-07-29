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
            Log::info('Registration attempt started');
            Log::info('Request data:', $request->all());
            Log::info('Registration attempt', $request->all());
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'surname' => 'nullable|string|max:255', // Added surname validation
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);
            
            Log::info('Validation passed');
            
            $user = User::create([
                'name' => $validated['name'],
                'surname' => $validated['surname'] ?? null, // Handle optional surname
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'user', // FIX: Set role to 'user'
                'is_active' => true, // FIX: Set user as active
            ]);
            
            Log::info('User created', ['user_id' => $user->id, 'role' => $user->role]);
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful'
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
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->first();

            // Check if user exists
            if (!$user) {
                Log::warning('Login attempt with non-existent email', ['email' => $validated['email']]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Check if user is active
            if (!$user->is_active) {
                Log::warning('Login attempt with inactive account', ['user_id' => $user->id]);
                return response()->json(['message' => 'Account is deactivated'], 401);
            }

            // Check password
            if (!Hash::check($validated['password'], $user->password)) {
                Log::warning('Login attempt with wrong password', ['user_id' => $user->id]);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Delete old tokens (optional - for single session)
            // $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Successful login', ['user_id' => $user->id, 'role' => $user->role]);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Login successful'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Login failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Login failed',
                'message' => 'An error occurred during login'
            ], 500);
        }
    }

    //Log-Out metoda - poboljšana sa info o role
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            
            Log::info('User logout attempt', [
                'user_id' => $user->id,
                'role' => $user->role,
                'email' => $user->email
            ]);
            
            // Obriši sve tokene
            $user->tokens()->delete();

            Log::info('User logged out successfully', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Logged out successfully',
                'user_role' => $user->role
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Logout failed'
            ], 500);
        }
    }

    // NOVA METODA - Brisanje guest account-a
    public function deleteGuestAccount(Request $request)
    {
        try {
            $user = $request->user();
            
            // Proveri da li je korisnik guest
            if ($user->role !== 'guest') {
                Log::warning('Non-guest user tried to delete guest account', [
                    'user_id' => $user->id,
                    'role' => $user->role
                ]);
                
                return response()->json([
                    'error' => 'Only guest accounts can be deleted automatically'
                ], 403);
            }
            
            Log::info('Deleting guest account', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
            // Obriši sve tokene
            $user->tokens()->delete();
            
            // Obriši korisnika iz baze
            $user->delete();
            
            Log::info('Guest account deleted successfully', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
            return response()->json([
                'message' => 'Guest account successfully deleted'
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Failed to delete guest account', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to delete guest account',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}