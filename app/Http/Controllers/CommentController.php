<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Dohvatanje svih komentara
    public function getCommentsByPost($post_id)
{
    $comments = Comment::where('post_id', $post_id)->get();
    return response()->json($comments, 200);
}

    // Kreiranje novog komentara
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'content' => 'required|string',
        'post_id' => 'required|exists:posts,id', // Veza sa Post modelom
    ]);

    $comment = Comment::create([
        'content' => $validatedData['content'],
        'post_id' => $validatedData['post_id'],
        'user_id' => auth()->id(), // Automatski postavlja ID trenutnog korisnika
    ]);

    return response()->json([
        'message' => 'Komentar uspešno kreiran',
        'comment' => $comment
    ], 201);
    
}


    // Prikazivanje jednog komentara
    public function show($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        return response()->json($comment, 200);
    }

    // Ažuriranje komentara
    public function update(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $validatedData = $request->validate([
            'content' => 'sometimes|string',
            'post_id' => 'sometimes|exists:posts,id',
        ]);

        $comment->update($validatedData);

        return response()->json($comment, 200);
    }

    // Brisanje komentara
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }
}