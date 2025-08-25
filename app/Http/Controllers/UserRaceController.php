<?php

namespace App\Http\Controllers;

use App\Models\Race;

class UserRaceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // Osigurava da je korisnik prijavljen
    }

    // Pridruživanje korisnika trci
    public function joinRace($raceId)
    {
        $race = Race::findOrFail($raceId);

        if ($race->start_date <= now()) {
            return response()->json(['message' => 'Prijava nije moguća jer je trka već počela.'], 400);
        }

        if ($race->hasParticipant(auth()->id())) {
            return response()->json(['message' => 'Već ste prijavljeni za ovu trku.'], 400);
        }

        $race->participants()->attach(auth()->id());

        return response()->json([
            'message' => 'Uspešno ste se pridružili trci!',
        ], 200);
    }
}

