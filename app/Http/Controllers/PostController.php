<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    // Get all posts
    public function index()
    {
        $posts = Post::with(['user', 'participants'])->get();
        return response()->json($posts, 200);
    }

    // Get single post
    public function show($id)
    {
        $post = Post::with(['user', 'participants'])->find($id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($post, 200);
    }

    // Create new running plan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'duration' => 'required|integer',
            'frequency' => 'required|integer', // FIX: Changed back to integer
            'distance' => 'required|numeric',
            'max_participants' => 'required|integer|min:1',
            // Removed user_id validation - we'll set it automatically
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Get all validated data and add user_id from authenticated user
        $data = $validator->validated();
        $data['user_id'] = $request->user()->id; // FIX: Auto-set user_id

        $runningPlan = Post::create($data);
        
        // Load the user relationship for response
        $runningPlan->load('user');
        
        return response()->json([
            'message' => 'Running plan created successfully', 
            'plan' => $runningPlan
        ], 201);
    }

    // Update running plan
    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Check if user owns this post
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'duration' => 'sometimes|integer',
            'frequency' => 'sometimes|integer', // FIX: Changed back to integer
            'distance' => 'sometimes|numeric',
            'max_participants' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $post->update($validator->validated());
        return response()->json(['message' => 'Post updated successfully', 'post' => $post], 200);
    }

    // Join running plan
    public function joinRunningPlan(Request $request, $id)
    {
        $plan = Post::find($id);
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        if ($plan->current_participants >= $plan->max_participants) {
            return response()->json(['message' => 'Plan is full'], 400);
        }

        $userId = $request->user()->id; // FIX: Use authenticated user, not request input

        // Check if user is trying to join their own plan
        if ($plan->user_id === $userId) {
            return response()->json(['message' => 'Cannot join your own plan'], 400);
        }

        if ($plan->participants()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'User already joined this plan'], 400);
        }

        $plan->participants()->attach($userId);
        $plan->increment('current_participants');
        
        // Load participants for response
        $plan->load(['participants', 'user']);
        
        return response()->json([
            'message' => 'Successfully joined the plan',
            'plan' => $plan
        ], 200);
    }

    // Filter running plans
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

    // Delete running plan
    public function deleteRunningPlan($id)
    {
        $plan = Post::find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        $plan->participants()->detach(); // Remove all participant relationships
        $plan->delete(); // Delete the plan

        return response()->json(['message' => 'Running plan deleted successfully'], 200);
    }
}