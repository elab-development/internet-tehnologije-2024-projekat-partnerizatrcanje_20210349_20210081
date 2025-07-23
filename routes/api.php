<?php
// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\UserRaceController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\RunningStatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test routes
Route::get('/test-status', function() {
    return response()->json(['message' => 'Testing status code'], 201);
});

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Fixed guest login route - now uses token-based auth like other routes
Route::post('/guest-login', function () {
    try {
        // Create guest user
        $guest = User::create([
            'name' => 'Gost',
            'surname' => 'Korisnik',
            'email' => 'guest_' . uniqid() . '@example.com',
            'password' => bcrypt('guest123'),
            'role' => 'guest',
            'is_active' => true,
        ]);

        // Create token instead of using Auth::login()
        $token = $guest->createToken('guest_token')->plainTextToken;

        return response()->json([
            'message' => 'Uspešno ste prijavljeni kao gost!',
            'user' => $guest,
            'token' => $token
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to create guest user',
            'message' => $e->getMessage()
        ], 500);
    }
})->name('api.guest-login');

// Routes for all authenticated users (including guests) - read-only
Route::middleware('auth:sanctum')->group(function () {
    // Auth test routes
    Route::get('/test-auth', function (Request $request) {
        return response()->json([
            'user' => $request->user(), 
            'message' => 'Uspešno autentifikovano'
        ]);
    })->name('api.test-auth');
    
    // User data
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('api.user');
    
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
    Route::get('/users/{id}/stats', [UserController::class, 'stats'])->name('api.users.stats');
    
    // Feed
    Route::get('/feed', [FeedController::class, 'index'])->name('api.feed');
    
    // Posts (read-only)F
    Route::get('/posts', [PostController::class, 'index'])->name('api.posts.index');
    Route::get('/posts/filter', [PostController::class, 'filterRunningPlans'])->name('api.posts.filter'); // BEFORE {id}
    Route::get('/posts/{id}', [PostController::class, 'show'])->name('api.posts.show');
    
    // Comments (read-only)
    Route::get('/posts/{post_id}/comments', [CommentController::class, 'getCommentsByPost'])->name('api.posts.comments');
    Route::get('/comments/{id}', [CommentController::class, 'show'])->name('api.comments.show');
    
    // Races and challenges (read-only)
    Route::get('/races', [RaceController::class, 'index'])->name('api.races.index');
    Route::get('/races/{id}', [RaceController::class, 'show'])->name('api.races.show');
    Route::get('/challenges', [ChallengeController::class, 'index'])->name('api.challenges.index');
    Route::get('/challenges/{id}', [ChallengeController::class, 'show'])->name('api.challenges.show');
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
});

// Routes for registered users only (not guests) - write operations
Route::middleware(['auth:sanctum', 'not.guest'])->group(function () {
    // User profile management
    Route::put('/user/{id}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/user/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');
    
    // Posts management
    Route::post('/posts', [PostController::class, 'store'])->name('api.posts.store');
    Route::put('/posts/{id}', [PostController::class, 'update'])->name('api.posts.update');
    Route::delete('/posts/{id}', [PostController::class, 'deleteRunningPlan'])->name('api.posts.destroy');
    Route::post('/posts/{id}/join', [PostController::class, 'joinRunningPlan'])->name('api.posts.join');
    
    // Comments management
    Route::post('/comments', [CommentController::class, 'store'])->name('api.comments.store');
    Route::put('/comments/{id}', [CommentController::class, 'update'])->name('api.comments.update');
    Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->name('api.comments.destroy');
    
    // Races management
    Route::post('/races', [RaceController::class, 'store'])->name('api.races.store');
    Route::put('/races/{id}', [RaceController::class, 'update'])->name('api.races.update');
    Route::delete('/races/{id}', [RaceController::class, 'destroy'])->name('api.races.destroy');
    Route::post('/races/{raceId}/join', [UserRaceController::class, 'joinRace'])->name('api.races.join');
    
    // Challenges management
    Route::post('/challenges', [ChallengeController::class, 'store'])->name('api.challenges.store');
    Route::put('/challenges/{id}', [ChallengeController::class, 'update'])->name('api.challenges.update');
    Route::delete('/challenges/{id}', [ChallengeController::class, 'destroy'])->name('api.challenges.destroy');
});

// Protected route for testing
Route::middleware(['auth:sanctum', 'not.guest'])->get('/protected', function () {
    return response()->json(['message' => 'Access granted']);
})->name('api.protected');