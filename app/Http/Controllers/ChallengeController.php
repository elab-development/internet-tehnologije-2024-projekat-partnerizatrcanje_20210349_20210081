<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChallengeController extends Controller
{
    // Prikaz svih izazova sa ispravnom logikom za status
    public function index()
    {
        try {
            $currentUser = Auth::user(); // Trenutno ulogovani korisnik
            
            $challenges = Challenge::with(['creator:id,name,surname', 'participants:id,name,surname,email'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($challenge) use ($currentUser) {
                    // Proveri da li je trenutni korisnik već pridružen ovom izazovu
                    $isUserJoined = $currentUser ? 
                        $challenge->participants->contains('id', $currentUser->id) : false;
                    
                    // ISPRAVKA - tri različita statusa na osnovu datuma
                    $now = \Carbon\Carbon::now();
                    $startDate = \Carbon\Carbon::parse($challenge->start_date);
                    $endDate = \Carbon\Carbon::parse($challenge->end_date);
                    
                    // Određuj status na osnovu datuma
                    if ($now->lt($startDate)) {
                        // Izazov još nije počeo - USKORO
                        $isActive = true; // Frontend će prikazati kao USKORO
                        $status = 'upcoming';
                    } elseif ($now->gte($startDate) && $now->lte($endDate)) {
                        // Izazov je u toku - AKTIVAN
                        $isActive = true;
                        $status = 'active';
                    } else {
                        // Izazov je završen - ZAVRŠEN
                        $isActive = false;
                        $status = 'finished';
                    }
                    
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
                        'participants' => $challenge->participants,
                        'participants_count' => $challenge->participants->count(),
                        'is_active' => $isActive, 
                        'status' => $status, // upcoming|active|finished
                        'is_user_joined' => $isUserJoined,
                        'created_at' => $challenge->created_at,
                    ];
                });

            return response()->json($challenges, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch challenges', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
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
            $challenge = Challenge::with(['creator:id,name,surname', 'participants:id,name,surname,email'])
                ->find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $currentUser = Auth::user();
            $isUserJoined = $currentUser ? 
                $challenge->participants->contains('id', $currentUser->id) : false;

            // Dodaj status informacije
            $now = \Carbon\Carbon::now();
            $startDate = \Carbon\Carbon::parse($challenge->start_date);
            $endDate = \Carbon\Carbon::parse($challenge->end_date);
            
            if ($now->lt($startDate)) {
                $status = 'upcoming';
                $canJoin = true;
            } elseif ($now->gte($startDate) && $now->lte($endDate)) {
                $status = 'active';
                $canJoin = true;
            } else {
                $status = 'finished';
                $canJoin = false;
            }

            $challengeData = $challenge->toArray();
            $challengeData['status'] = $status;
            $challengeData['can_join'] = $canJoin;
            $challengeData['is_user_joined'] = $isUserJoined;
            $challengeData['participants_count'] = $challenge->participants->count();

            return response()->json($challengeData, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch challenge', [
                'challenge_id' => $id,
                'error' => $e->getMessage()
            ]);
            
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

            Log::info('Challenge created successfully', [
                'challenge_id' => $challenge->id,
                'name' => $challenge->name,
                'created_by' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Izazov je uspešno kreiran.',
                'challenge' => $challenge,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create challenge', [
                'error' => $e->getMessage(),
                'request_data' => $request->all(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'error' => 'Failed to create challenge',
                'message' => 'Došlo je do greške prilikom kreiranja izazova.'
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

            Log::info('Challenge updated successfully', [
                'challenge_id' => $challenge->id,
                'updated_by' => Auth::id(),
                'changes' => $validated
            ]);

            return response()->json([
                'message' => 'Izazov je uspešno ažuriran.',
                'challenge' => $challenge,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update challenge', [
                'challenge_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'error' => 'Failed to update challenge',
                'message' => 'Došlo je do greške prilikom ažuriranja izazova.'
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

            $challengeName = $challenge->name;
            $participantsCount = $challenge->participants->count();

            // Obriši sve veze sa učesnicima
            $challenge->participants()->detach();
            
            // Obriši izazov
            $challenge->delete();

            Log::info('Challenge deleted successfully', [
                'challenge_id' => $id,
                'challenge_name' => $challengeName,
                'participants_count' => $participantsCount,
                'deleted_by' => Auth::id()
            ]);

            return response()->json(['message' => 'Izazov je uspešno obrisan.'], 200);

        } catch (\Exception $e) {
            Log::error('Failed to delete challenge', [
                'challenge_id' => $id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'error' => 'Failed to delete challenge',
                'message' => 'Došlo je do greške prilikom brisanja izazova.'
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

            // Proveri status izazova
            $now = \Carbon\Carbon::now();
            $startDate = \Carbon\Carbon::parse($challenge->start_date);
            $endDate = \Carbon\Carbon::parse($challenge->end_date);

            // Proveri da li je izazov dostupan za pridruživanje
            if ($now->lt($startDate)) {
                return response()->json(['message' => 'Izazov još nije počeo. Možete se pridružiti kada počne.'], 400);
            }
            
            if ($now->gt($endDate)) {
                return response()->json(['message' => 'Izazov je završen i više nije moguće pridruživanje.'], 400);
            }

            // Proveri da li je korisnik već pridružen
            if ($challenge->participants()->where('user_id', $user->id)->exists()) {
                return response()->json(['message' => 'Već ste pridruženi ovom izazovu.'], 400);
            }

            // Pridruži korisnika
            $challenge->participants()->attach($user->id, [
                'distance_completed' => 0,
                'completed_at' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            Log::info('User joined challenge successfully', [
                'challenge_id' => $challenge->id,
                'challenge_name' => $challenge->name,
                'user_id' => $user->id,
                'user_email' => $user->email
            ]);

            return response()->json([
                'message' => 'Uspešno ste se pridružili izazovu!',
                'challenge' => $challenge->load('participants:id,name,surname,email')
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to join challenge', [
                'challenge_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to join challenge',
                'message' => 'Došlo je do greške prilikom pridruživanja izazovu.'
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

            Log::info('User left challenge successfully', [
                'challenge_id' => $challenge->id,
                'challenge_name' => $challenge->name,
                'user_id' => $user->id,
                'user_email' => $user->email
            ]);

            return response()->json([
                'message' => 'Uspešno ste napustili izazov.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to leave challenge', [
                'challenge_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to leave challenge',
                'message' => 'Došlo je do greške prilikom napuštanja izazova.'
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
                'distance_completed' => 'required|numeric|min:0|max:' . ($challenge->target_distance * 2), // Maksimalno duplo od ciljne distance
            ]);

            $distanceCompleted = $validated['distance_completed'];
            $isCompleted = $distanceCompleted >= $challenge->target_distance;

            // Ažuriraj progres
            $challenge->participants()->updateExistingPivot($user->id, [
                'distance_completed' => $distanceCompleted,
                'completed_at' => $isCompleted ? now() : null,
                'updated_at' => now()
            ]);

            Log::info('Challenge progress updated', [
                'challenge_id' => $challenge->id,
                'user_id' => $user->id,
                'distance_completed' => $distanceCompleted,
                'target_distance' => $challenge->target_distance,
                'is_completed' => $isCompleted
            ]);

            return response()->json([
                'message' => 'Progres je uspešno ažuriran.',
                'distance_completed' => $distanceCompleted,
                'target_distance' => $challenge->target_distance,
                'progress_percentage' => round(($distanceCompleted / $challenge->target_distance) * 100, 2),
                'completed' => $isCompleted
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update challenge progress', [
                'challenge_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to update progress',
                'message' => 'Došlo je do greške prilikom ažuriranja progresa.'
            ], 500);
        }
    }

    // NOVA METODA: Dohvatanje svih učesnika izazova
    public function getParticipants($id)
    {
        try {
            $challenge = Challenge::with(['participants:id,name,surname,email'])->find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $participants = $challenge->participants->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'name' => $participant->name,
                    'surname' => $participant->surname,
                    'email' => $participant->email,
                    'distance_completed' => $participant->pivot->distance_completed ?? 0,
                    'completed_at' => $participant->pivot->completed_at,
                    'joined_at' => $participant->pivot->created_at
                ];
            });

            return response()->json([
                'challenge' => [
                    'id' => $challenge->id,
                    'name' => $challenge->name,
                    'target_distance' => $challenge->target_distance
                ],
                'participants' => $participants,
                'total_participants' => $participants->count()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch challenge participants', [
                'challenge_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch participants',
                'message' => 'Došlo je do greške prilikom dohvatanja učesnika.'
            ], 500);
        }
    }

    // NOVA METODA: Dohvatanje leaderboard-a za izazov
    public function getLeaderboard($id)
    {
        try {
            $challenge = Challenge::with(['participants:id,name,surname'])->find($id);

            if (!$challenge) {
                return response()->json(['message' => 'Izazov nije pronađen'], 404);
            }

            $leaderboard = $challenge->participants
                ->sortByDesc('pivot.distance_completed')
                ->take(10) // Top 10
                ->values()
                ->map(function ($participant, $index) use ($challenge) {
                    return [
                        'rank' => $index + 1,
                        'id' => $participant->id,
                        'name' => $participant->name . ' ' . $participant->surname,
                        'distance_completed' => $participant->pivot->distance_completed ?? 0,
                        'progress_percentage' => $challenge->target_distance > 0 
                            ? round(($participant->pivot->distance_completed / $challenge->target_distance) * 100, 2)
                            : 0,
                        'completed_at' => $participant->pivot->completed_at,
                        'is_completed' => ($participant->pivot->distance_completed ?? 0) >= $challenge->target_distance
                    ];
                });

            return response()->json([
                'challenge' => [
                    'id' => $challenge->id,
                    'name' => $challenge->name,
                    'target_distance' => $challenge->target_distance
                ],
                'leaderboard' => $leaderboard
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch challenge leaderboard', [
                'challenge_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch leaderboard',
                'message' => 'Došlo je do greške prilikom dohvatanja leaderboard-a.'
            ], 500);
        }
    }
}