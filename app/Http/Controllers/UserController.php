<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // Prikaz svih korisnika
    public function index(Request $request)
    {
        $status = $request->query('status');
        $users = User::when($status, function ($query, $status) {
            return $query->where('is_active', $status === 'active');
        })->get();

        return response()->json($users, 200);
    }

    // Kreiranje novog korisnika 
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = User::create([
            'name' => $validatedData['name'],
            'surname' => $validatedData['surname'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        return response()->json($user, 201);
    }

    // Prikaz pojedinačnog korisnika
    public function show($id)
    {
        $user = User::with('runningStats')->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Dodaj punu URL za profilnu sliku
        if ($user->profile_image) {
            $user->profile_image_url = asset('storage/' . $user->profile_image);
        } else {
            $user->profile_image_url = null;
        }

        return response()->json($user, 200);
    }

    // Ažuriranje korisnika
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Validacija
        $validatedData = $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
            'description' => 'sometimes|string|max:1000',
            'height' => 'sometimes|integer|min:100|max:250',
            'weight' => 'sometimes|numeric|min:30|max:300',
        ]);

        // Proverite trenutnu lozinku
        if (isset($validatedData['current_password']) && !Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        // Hashovanje nove lozinke (ako postoji)
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Ukloni current_password iz podataka za ažuriranje
        unset($validatedData['current_password']);

        // Ažuriranje korisnika
        $user->update($validatedData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ], 200);
    }

    // Upload profile image
    public function uploadProfileImage(Request $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Proverava da li je korisnik autentifikovan i da li pokušava da ažurira svoj profil
            if ($request->user()->id != $id && !$request->user()->isAdmin()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $request->validate([
                'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            ]);

            // Obriši staru sliku ako postoji
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Sačuvaj novu sliku
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
            
            // Ažuriraj korisnika
            $user->update(['profile_image' => $imagePath]);

            $imageUrl = asset('storage/' . $imagePath);

            Log::info('Profile image uploaded successfully', [
                'user_id' => $user->id,
                'image_path' => $imagePath,
                'image_url' => $imageUrl
            ]);

            return response()->json([
                'message' => 'Profile image uploaded successfully',
                'image_url' => $imageUrl,
                'image_path' => $imagePath
            ], 200);

        } catch (\Exception $e) {
            Log::error('Profile image upload failed', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to upload profile image',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Brisanje korisnika
    public function destroy(Request $request, $id)
    {
        // Pronalazi korisnika koji treba da bude obrisan
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Korisnik nije pronađen.'], 404);
        }

        // Provera da li je korisnik autentifikovan
        if (!$request->user()) {
            return response()->json(['error' => 'Niste autentifikovani.'], 401);
        }

        // Dozvoli brisanje ako je korisnik admin ili briše svoj nalog
        if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Nemate dozvolu za brisanje ovog naloga.'], 403);
        }

        // Obriši profilnu sliku ako postoji
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // Brisanje korisnika
        $user->delete();

        return response()->json(['message' => 'Korisnik je uspešno obrisan.'], 200);
    }

    // Prikaz statistika korisnika
    public function stats($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Korisnik nije pronađen'], 404);
        }

        return response()->json(['stats' => $user->running_stats], 200);
    }

    // Get current user profile
    public function getCurrentUserProfile(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Dodaj punu URL za profilnu sliku
        if ($user->profile_image) {
            $user->profile_image_url = asset('storage/' . $user->profile_image);
        } else {
            $user->profile_image_url = null;
        }

        return response()->json($user, 200);
    }
}