<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FeedController extends Controller
{
    /**
     * Get paginated posts for feed
     * Returns last 15 posts per page, newest first, with comments
     */
    public function index(Request $request)
    {
        try {
            // Prvo proveri ukupan broj postova u tabeli
            $totalPosts = Post::count();
            Log::info("Total posts in database: " . $totalPosts);

            // Dohvati sve post ID-jeve da vidimo sortiranje
            $allPostIds = Post::orderBy('created_at', 'DESC')
                             ->orderBy('id', 'DESC')
                             ->pluck('id')
                             ->toArray();
            Log::info("All post IDs (newest first): " . implode(', ', $allPostIds));

            // Dohvati postove sa paginacijom - EKSPLICITNO najnoviji prvi
            $posts = Post::with([
                'user:id,name,surname,email',
                'comments.user:id,name,surname',
                'participants:id,name,surname,email'
            ])
            ->orderBy('created_at', 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(15);

            // Debug informacije
            Log::info('Feed pagination info', [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'count' => $posts->count(),
                'per_page' => $posts->perPage(),
                'from' => $posts->firstItem(),
                'to' => $posts->lastItem(),
                'post_ids_on_page' => $posts->pluck('id')->toArray()
            ]);

            // Ako nema postova, vrati prazan rezultat sa pagination strukturom
            if ($posts->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 15,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                    'message' => 'Trenutno nema objava.'
                ], 200);
            }

            return response()->json($posts, 200);
            
        } catch (\Exception $e) {
            Log::error('Feed error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to fetch feed',
                'message' => 'Greška pri učitavanju objava. Molimo pokušajte ponovo.'
            ], 500);
        }
    }

    /**
     * Get posts with additional filtering options
     */
    public function getFilteredFeed(Request $request)
    {
        try {
            $query = Post::with([
                'user:id,name,surname,email',
                'comments.user:id,name,surname',
                'participants:id,name,surname,email'
            ]);

            // Filtriranje po tipu posta (ako postoji type kolona)
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filtriranje po distance
            if ($request->has('min_distance')) {
                $query->where('distance', '>=', $request->min_distance);
            }

            if ($request->has('max_distance')) {
                $query->where('distance', '<=', $request->max_distance);
            }

            // Filtriranje po duration
            if ($request->has('min_duration')) {
                $query->where('duration', '>=', $request->min_duration);
            }

            if ($request->has('max_duration')) {
                $query->where('duration', '<=', $request->max_duration);
            }

            // Filtriranje po frequency
            if ($request->has('frequency')) {
                $query->where('frequency', $request->frequency);
            }

            // Sortiranje - uvek najnoviji prvi
            $query->orderBy('created_at', 'desc');

            // Paginacija
            $perPage = $request->get('per_page', 15);
            $perPage = min($perPage, 50); // Maksimalno 50 po stranici
            
            $posts = $query->paginate($perPage);

            return response()->json($posts, 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch filtered feed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get posts from users that current user follows (if you have following system)
     */
    public function getFollowingFeed(Request $request)
    {
        try {
            $user = $request->user();

            // Ako imaš following sistem, ovo će trebati modificirati
            // $followingUserIds = $user->following()->pluck('id');

            $posts = Post::with([
                'user:id,name,surname,email',
                'comments.user:id,name,surname',
                'participants:id,name,surname,email'
            ])
            // ->whereIn('user_id', $followingUserIds) // Uncomment ako imaš following
            ->orderBy('created_at', 'desc')
            ->paginate(15);

            return response()->json($posts, 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch following feed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}