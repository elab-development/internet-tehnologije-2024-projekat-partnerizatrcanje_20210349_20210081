<?php

namespace App\Http\Controllers;

use App\Models\Race;
use Illuminate\Http\Request;

class RaceController extends Controller
{
    // Kreiranje nove trke
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
            'distance' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'prize' => 'nullable|numeric|min:0',
        ]);

        $race = Race::create([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'distance' => $request->distance,
            'description' => $request->description,
            'prize' => $request->prize, // ispravljeno
            'organizer_id' => auth()->id(), // organizator je autentifikovani korisnik
        ]);

        return response()->json([
            'message' => 'Virtuelna trka je uspešno kreirana.',
            'data' => $race,
        ], 201);
    }
}
