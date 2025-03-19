<?php

namespace App\Http\Controllers;

use App\Models\Race;
use Illuminate\Http\Request;

class RaceController extends Controller
{
    // Kreiranje nove trke
    public function store(Request $request)
{
    // Proverava da li je korisnik admin
    if (auth()->user()->role !== 'admin')  {
        return response()->json(['message' => 'Samo admini mogu kreirati trke.'], 403);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'start_date' => 'required|date|after:today',
        'end_date' => 'required|date|after:start_date',
        'distance' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'prize' => 'nullable|numeric|min:0',
    ]);

    // Samo admin može biti organizator, uzima njegov ID
    $race = Race::create([
        'name' => $request->name,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'distance' => $request->distance,
        'description' => $request->description,
        'prize' => $request->prize,
        'organizer_id' => auth()->id(),
    ]);

    return response()->json([
        'message' => 'Virtuelna trka je uspešno kreirana.',
        'data' => $race,
    ], 201);
}

}
