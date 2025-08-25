<?php

namespace App\Http\Controllers;

use App\Models\Race;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RaceController extends Controller
{
    // Prikaz svih trka
    public function index()
    {
        try {
            $currentUser = Auth::user(); // Trenutno ulogovani korisnik
            
            $races = Race::with(['organizer:id,name,surname', 'participants:id,name,surname,email'])
                ->orderBy('race_date', 'asc')
                ->get()
                ->map(function ($race) use ($currentUser) {
                    // Proveri da li je trenutni korisnik već pridružen ovoj trci
                    $isUserJoined = $currentUser ? 
                        $race->participants->contains('id', $currentUser->id) : false;
                    
                    return [
                        'id' => $race->id,
                        'name' => $race->name,
                        'description' => $race->description,
                        'race_date' => $race->race_date,
                        'start_time' => $race->start_time,
                        'end_time' => $race->end_time,
                        'distance' => $race->distance,
                        'prize' => $race->prize,
                        'max_participants' => $race->max_participants,
                        'organizer' => $race->organizer,
                        'participants' => $race->participants, // Dodano za frontend
                        'participants_count' => $race->participants->count(),
                        'is_active' => $race->isActive(),
                        'can_join' => $race->canJoin(),
                        'is_registration_expired' => $race->isRegistrationExpired(),
                        'is_user_joined' => $isUserJoined, // NOVO - da li je user pridružen
                        'created_at' => $race->created_at,
                    ];
                });

            return response()->json($races, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch races',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Prikaz pojedinačne trke
    public function show($id)
    {
        try {
            $race = Race::with(['organizer:id,name,surname', 'participants:id,name,surname'])
                ->find($id);

            if (!$race) {
                return response()->json(['message' => 'Trka nije pronađena'], 404);
            }

            return response()->json($race, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch race',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    // Kreiranje trke (samo admin)
    public function store(Request $request)
    {
        try {
            // Proveri da li je korisnik admin
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Samo administratori mogu kreirati trke.'], 403);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'race_date' => 'required|date|after_or_equal:today',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'distance' => 'required|numeric|min:0.1',
                'max_participants' => 'required|integer|min:1',
                'prize' => 'nullable|string|max:255',
            ]);

            // Konvertuj vremena u DateTime objekte
            $raceDate = \Carbon\Carbon::parse($validated['race_date']);
            $startTime = $raceDate->copy()->setTimeFromTimeString($validated['start_time']);
            $endTime = $raceDate->copy()->setTimeFromTimeString($validated['end_time']);

            $race = Race::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'race_date' => $raceDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'distance' => $validated['distance'],
                'max_participants' => $validated['max_participants'],
                'prize' => $validated['prize'],
                'organizer_id' => Auth::id(),
            ]);

            $race->load('organizer:id,name,surname');

            return response()->json([
                'message' => 'Trka je uspešno kreirana.',
                'race' => $race,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create race',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    // Pridruživanje trci (user + admin) - AŽURIRANA METODA
    public function join(Request $request, $id)
    {
        try {
            $race = Race::find($id);

            if (!$race) {
                return response()->json(['message' => 'Trka nije pronađena'], 404);
            }

            $user = Auth::user();

            // Proveri da li je deadline za prijavu prošao
            if ($race->isRegistrationExpired()) {
                return response()->json(['message' => 'Vreme za prijavu na trku je isteklo.'], 400);
            }

            // Proveri da li trka može da se join-uje (ima mesta)
            if ($race->participants()->count() >= $race->max_participants) {
                return response()->json(['message' => 'Trka je popunjena.'], 400);
            }

            // Proveri da li je korisnik već pridružen
            if ($race->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Već ste pridruženi ovoj trci.'], 400);
            }

            // Pridruži korisnika
            $race->participants()->attach($user->id, [
                'finish_time' => null,
                'completed_at' => null,
                'result_submitted' => false
            ]);

            return response()->json([
                'message' => 'Uspešno ste se pridružili trci!',
                'race' => $race->load('participants')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to join race',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Napuštanje trke
    public function leave(Request $request, $id)
    {
        try {
            $race = Race::find($id);

            if (!$race) {
                return response()->json(['message' => 'Trka nije pronađena'], 404);
            }

            $user = Auth::user();

            // Proveri da li je korisnik pridružen
            if (!$race->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Niste pridruženi ovoj trci.'], 400);
            }

            // Ne dozvoli napuštanje tokom trke
            if ($race->isActive()) {
                return response()->json(['message' => 'Ne možete napustiti trku dok je u toku.'], 400);
            }

            // Ukloni korisnika
            $race->participants()->detach($user->id);

            return response()->json([
                'message' => 'Uspešno ste napustili trku.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to leave race',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}