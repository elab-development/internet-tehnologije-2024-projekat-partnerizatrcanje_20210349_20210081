<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    // Kreiranje izazova
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'requirements' => 'nullable|string',
            'rewards' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
        ]);

        $challenge = Challenge::create($request->all());

        return response()->json([
            'message' => 'Izazov je uspešno kreiran.',
            'data' => $challenge,
        ], 201);
    }
}
