<?php

namespace App\Http\Controllers;

use App\Models\Race;
use Illuminate\Http\Request;

class UserRaceController extends Controller
{
    // Pridruživanje korisnika trci
    public function joinRace(Request $request, $raceId)
    {
        $race = Race::findOrFail($raceId);

        if ($race->start_date <= now()) {
            return response()->json(['message' => 'Prijava nije moguća jer je trka već počela.'], 400);
        }

        if ($race->participants()->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['message' => 'Već ste prijavljeni za ovu trku.'], 400);
        }

        $race->participants()->attach($request->user()->id);

        return response()->json([
            'message' => 'Uspešno ste se pridružili trci!',
        ], 200);
    }
}
