<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reaction;
use App\Models\Comment;

class ReactionController extends Controller
{
    public function addReaction(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'emoji' => 'required|string'
        ]);

        $reaction = Reaction::create([
            'post_id' => $request->post_id,
            'user_id' => $request->user_id,
            'emoji' => $request->emoji,
        ]);

        return response()->json(['message' => 'Reakcija dodata.', 'reaction' => $reaction], 201);
    }

    public function addComment(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => $request->user_id,
            'content' => $request->content,
        ]);

        return response()->json(['message' => 'Komentar dodat.', 'comment' => $comment], 201);
    }
}
