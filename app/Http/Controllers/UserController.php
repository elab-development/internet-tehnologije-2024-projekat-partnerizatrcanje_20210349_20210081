<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'surname' => 'required|string|max:255', // Validacija prezimena
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = User::create([
            'name' => $validatedData['name'],
            'surname' => $validatedData['surname'], // Čuvanje prezimena
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);
        

        return response()->json($user, 201);
    }

    //Login user
    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json(['error' => 'Pogrešni kredencijali'], 401);
    }

    if (!$user->is_active) {
        return response()->json(['error' => 'Vaš nalog je deaktiviran.'], 403);
    }

    return response()->json(['message' => 'Uspešna prijava', 'user' => $user], 200);
}


    // Prikaz pojedinačnog korisnika
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
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

    $validatedData = $request->validate([
        'name' => 'sometimes|string|max:255',
        'surname' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'current_password' => 'required_with:password|string',
        'password' => 'sometimes|string|min:8|confirmed',
    ]);

    // Proverite trenutnu lozinku
    if (isset($validatedData['current_password']) && !Hash::check($validatedData['current_password'], $user->password)) {
        return response()->json(['error' => 'Current password is incorrect'], 400);
    }

    // Hashovanje nove lozinke (ako postoji)
    if (isset($validatedData['password'])) {
        $validatedData['password'] = Hash::make($validatedData['password']);
    }

    // Ažuriranje korisnika
    $user->update($validatedData);

    return response()->json($user, 200);
}


    // Brisanje korisnika
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        // Proverite administratorske privilegije
        if (!$request->user()->is_admin) {
            return response()->json(['error' => 'Nemate dozvolu za brisanje ovog naloga.'], 403);
        }
    
        $user->delete();
    
        return response()->json(['message' => 'User deleted successfully'], 200);
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

}
