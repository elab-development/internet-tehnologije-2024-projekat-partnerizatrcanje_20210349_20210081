<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChallengeController extends Controller
{
    // Prikaz svih izazova
    public function index()
    {
        try {
            $challenges = Challenge::with(['creator:id,name,surname', 'participants'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($challenge) {
                    return [
                        'id' => $challenge->id,
                        'name' => $challenge->name,
                        'description' => $challenge->description,
                        'target_distance' => $challenge->target_distance,
                        'duration_days' => $challenge->duration_days,
                        'start_date' => $challenge->start_date,
                        'end_date' => $challenge->end_date,
                        'prize' => $challenge->prize,
                        'creator' => $challenge->creator,
                        'participants_count' => $challenge->participants->count(),
                        'is_active' => $challenge->isActive(),
                        'created_at' => $challenge->created_at,
                    ];
                });

            return response()->json($challenges, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch challenges',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Prikaz pojedinačnog izazova
    public function show($id)
    {
        try {
            $challenge = Challenge::with(['creator:id,name,surname', 'participants:id,name,surname'])
                ->find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            return response()->json($challenge, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Kreiranje izazova (samo admin)
    public function store(Request $request)
    {
        try {
            // Proveri da li je korisnik admin
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Samo administratori mogu kreirati izazove.'], 403);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'target_distance' => 'required|numeric|min:0.1',
                'duration_days' => 'required|integer|min:1|max:365',
                'start_date' => 'required|date|after_or_equal:today',
                'prize' => 'nullable|string|max:255',
            ]);

            // Automatski izračunaj end_date
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $endDate = $startDate->copy()->addDays($validated['duration_days']);

            $challenge = Challenge::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'target_distance' => $validated['target_distance'],
                'duration_days' => $validated['duration_days'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'prize' => $validated['prize'],
                'created_by' => Auth::id(),
            ]);

            $challenge->load('creator:id,name,surname');

            return response()->json([
                'message' => 'Izazov je uspešno kreiran.',
                'challenge' => $challenge,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Ažuriranje izazova (samo admin koji je kreirao)
    public function update(Request $request, $id)
    {
        try {
            $challenge = Challenge::find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            // Proveri da li je korisnik admin i kreator izazova
            if (Auth::user()->role !== 'admin' || $challenge->created_by !== Auth::id()) {
                return response()->json(['message' => 'Nemate dozvolu za ažuriranje ovog izazova.'], 403);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'target_distance' => 'sometimes|numeric|min:0.1',
                'duration_days' => 'sometimes|integer|min:1|max:365',
                'start_date' => 'sometimes|date',
                'prize' => 'sometimes|nullable|string|max:255',
            ]);

            // Ako se menjaju datumi, preračunaj end_date
            if (isset($validated['start_date']) || isset($validated['duration_days'])) {
                $startDate = isset($validated['start_date']) 
                    ? \Carbon\Carbon::parse($validated['start_date'])
                    : $challenge->start_date;
                
                $durationDays = $validated['duration_days'] ?? $challenge->duration_days;
                $validated['end_date'] = $startDate->copy()->addDays($durationDays);
            }

            $challenge->update($validated);
            $challenge->load('creator:id,name,surname');

            return response()->json([
                'message' => 'Izazov je uspešno ažuriran.',
                'challenge' => $challenge,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Brisanje izazova (samo admin koji je kreirao)
    public function destroy($id)
    {
        try {
            $challenge = Challenge::find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            // Proveri da li je korisnik admin i kreator izazova
            if (Auth::user()->role !== 'admin' || $challenge->created_by !== Auth::id()) {
                return response()->json(['message' => 'Nemate dozvolu za brisanje ovog izazova.'], 403);
            }

            // Obriši sve veze sa učesnicima
            $challenge->participants()->detach();
            
            // Obriši izazov
            $challenge->delete();

            return response()->json(['message' => 'Izazov je uspešno obrisan.'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Pridruživanje izazovu (user + admin)
    public function join(Request $request, $id)
    {
        try {
            $challenge = Challenge::find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $user = Auth::user();

            // Proveri da li je izazov aktivan
            if (!$challenge->isActive()) {
                return response()->json(['message' => 'Izazov nije trenutno aktivan.'], 400);
            }

            // Proveri da li je korisnik već pridružen
            if ($challenge->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Već ste pridruženi ovom izazovu.'], 400);
            }

            // Pridruži korisnika
            $challenge->participants()->attach($user->id, [
                'distance_completed' => 0,
                'completed_at' => null
            ]);

            return response()->json([
                'message' => 'Uspešno ste se pridružili izazovu!',
                'challenge' => $challenge->load('participants')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to join challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Napuštanje izazova
    public function leave(Request $request, $id)
    {
        try {
            $challenge = Challenge::find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $user = Auth::user();

            // Proveri da li je korisnik pridružen
            if (!$challenge->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Niste pridruženi ovom izazovu.'], 400);
            }

            // Ukloni korisnika
            $challenge->participants()->detach($user->id);

            return response()->json([
                'message' => 'Uspešno ste napustili izazov.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to leave challenge',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Ažuriranje progresa u izazovu
    public function updateProgress(Request $request, $id)
    {
        try {
            $challenge = Challenge::find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $user = Auth::user();

            // Proveri da li je korisnik pridružen
            $participation = $challenge->participants()->where('user_id', $user->id)->first();
            if (!$participation) {
                return response()->json(['message' => 'Niste pridruženi ovom izazovu.'], 400);
            }

            $validated = $request->validate([
                'distance_completed' => 'required|numeric|min:0',
            ]);

            // Ažuriraj progres
            $challenge->participants()->updateExistingPivot($user->id, [
                'distance_completed' => $validated['distance_completed'],
                'completed_at' => $validated['distance_completed'] >= $challenge->target_distance ? now() : null
            ]);

            return response()->json([
                'message' => 'Progres je uspešno ažuriran.',
                'completed' => $validated['distance_completed'] >= $challenge->target_distance
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update progress',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}