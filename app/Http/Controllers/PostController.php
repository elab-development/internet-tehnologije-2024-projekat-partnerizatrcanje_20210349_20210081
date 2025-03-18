<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    // Metoda za kreiranje plana trčanja
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'duration' => 'required|integer',
            'frequency' => 'required|integer',
            'distance' => 'required|numeric',
            'max_participants' => 'required|integer|min:1',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $runningPlan = Post::create($request->all());
        return response()->json(['message' => 'Running plan created successfully', 'plan' => $runningPlan], 201);
    }

    // Metoda za pridruživanje korisnika planu trčanja
    public function joinRunningPlan(Request $request, $id)
    {
        $plan = Post::find($id);
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        if ($plan->current_participants >= $plan->max_participants) {
            return response()->json(['message' => 'Plan is full'], 400);
        }

        $userId = $request->input('user_id');
        if (!$userId || !User::find($userId)) {
            return response()->json(['message' => 'Invalid user'], 400);
        }

        if ($plan->participants()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'User already joined this plan'], 400);
        }

        $plan->participants()->attach($userId);
        $plan->increment('current_participants');
        return response()->json(['message' => 'User successfully joined the plan'], 200);
    }

    // Metoda za filtriranje planova trčanja
    public function filterRunningPlans(Request $request)
    {
        $query = Post::query();

        if ($request->filled('duration')) {
            $query->where('duration', $request->input('duration'));
        }
        if ($request->filled('distance')) {
            $query->where('distance', '>=', $request->input('distance'));
        }
        if ($request->filled('frequency')) {
            $query->where('frequency', $request->input('frequency'));
        }
        if ($request->filled('max_participants')) {
            $query->where('max_participants', '>=', $request->input('max_participants'));
        }

        $filteredPlans = $query->with('user')->get();
        return response()->json($filteredPlans, 200);
    }

    //Metoda za brisanje postova
    // Brisanje plana trčanja
    public function deleteRunningPlan($id)
    {
        $plan = Post::find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        $plan->participants()->detach(); // Uklanja sve poveznice sa učesnicima
        $plan->delete(); // Briše plan

        return response()->json(['message' => 'Running plan deleted successfully'], 200);
    }

}

