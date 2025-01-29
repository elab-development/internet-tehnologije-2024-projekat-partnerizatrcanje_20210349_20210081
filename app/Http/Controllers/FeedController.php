<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class FeedController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments'])->latest()->get();

        if ($posts->isEmpty()) {
            return response()->json(['message' => 'Trenutno nema objava.'], 200);
        }

        return response()->json($posts, 200);
    }
}
