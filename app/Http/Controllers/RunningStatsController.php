<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RunningStats;
use App\Models\User;

class RunningStatsController extends Controller
{
    public function getStats($user_id)
    {
        $stats = RunningStats::where('user_id', $user_id)->first();

        if (!$stats) {
            return response()->json(['message' => 'Nema statistike za ovog korisnika.'], 404);
        }

        return response()->json($stats, 200);
    }
}
