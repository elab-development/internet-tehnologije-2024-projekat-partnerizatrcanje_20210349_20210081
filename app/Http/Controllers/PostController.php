<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    // Prikaz svih postova
    public function index()
    {
        $posts = Post::with('user', 'category')->get(); // Uključivanje povezanih korisnika i kategorija
        return response()->json($posts, 200);
    }

    // Prikaz jednog posta po ID-u
    public function show($id)
    {
        $post = Post::with('user', 'category')->find($id);
        if ($post) {
            return response()->json($post, 200);
        }
        return response()->json(['message' => 'Post not found'], 404);
    }

    // Kreiranje novog posta
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $post = Post::create($request->all());
        return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
    }

    // Ažuriranje postojećeg posta
    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'user_id' => 'sometimes|exists:users,id',
            'category_id' => 'sometimes|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $post->update($request->all());
        return response()->json(['message' => 'Post updated successfully', 'post' => $post], 200);
    }

    // Brisanje posta
    public function destroy($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }
}
