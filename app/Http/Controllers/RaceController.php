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
            'rewards' => 'nullable|string',
        ]);

        $race = Race::create($request->all());

        return response()->json([
            'message' => 'Virtuelna trka je uspešno kreirana.',
            'data' => $race,
        ], 201);
    }
}
