<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
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

Route::post('/debug-register', function(Request $request) {
    Log::info('=== DEBUG REGISTER ROUTE HIT ===');
    Log::info('Request data:', $request->all());
    return response()->json([
        'message' => 'Debug successful', 
        'received_data' => $request->all(),
        'time' => now()
    ]);
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (No authentication required)
|--------------------------------------------------------------------------
*/

// Authentication routes
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Guest login route
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

        // Create token
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

// Feed - dostupan svima (uključujući guest)
Route::get('/feed', [FeedController::class, 'index'])->name('api.feed.public');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES (All logged users including guests)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // Auth test routes
    Route::get('/test-auth', function (Request $request) {
        return response()->json([
            'user' => $request->user(), 
            'message' => 'Uspešno autentifikovano'
        ]);
    })->name('api.test-auth');
    
    // Current user data
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('api.user');
    
    // Guest account deletion
    Route::delete('/delete-guest-account', [AuthController::class, 'deleteGuestAccount']);
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    
    /*
    |--------------------------------------------------------------------------
    | READ-ONLY ROUTES (All authenticated users including guests)
    |--------------------------------------------------------------------------
    */
    
    // Users (read-only)
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
    Route::get('/users/{id}/stats', [UserController::class, 'stats'])->name('api.users.stats');
    
    // Posts (read-only)
    Route::get('/posts', [PostController::class, 'index'])->name('api.posts.index');
    Route::get('/posts/filter', [PostController::class, 'filterRunningPlans'])->name('api.posts.filter');
    Route::get('/posts/{id}', [PostController::class, 'show'])->name('api.posts.show');
    
    // Comments (read-only)
    Route::get('/posts/{post_id}/comments', [CommentController::class, 'getCommentsByPost'])->name('api.posts.comments');
    Route::get('/comments/{id}', [CommentController::class, 'show'])->name('api.comments.show');
    
    // Races (read-only)
    Route::get('/races', [RaceController::class, 'index'])->name('api.races.index');
    Route::get('/races/{id}', [RaceController::class, 'show'])->name('api.races.show');
    
    // Challenges (read-only)
    Route::get('/challenges', [ChallengeController::class, 'index'])->name('api.challenges.index');
    Route::get('/challenges/{id}', [ChallengeController::class, 'show'])->name('api.challenges.show');

});

/*
|--------------------------------------------------------------------------
| REGISTERED USERS ONLY (not guests) - WRITE OPERATIONS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'not.guest'])->group(function () {
    
    /*
    |--------------------------------------------------------------------------
    | USER PROFILE MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::put('/user/{id}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/user/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');
    
    /*
    |--------------------------------------------------------------------------
    | POSTS MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::post('/posts', [PostController::class, 'store'])->name('api.posts.store');
    Route::put('/posts/{id}', [PostController::class, 'update'])->name('api.posts.update');
    Route::delete('/posts/{id}', [PostController::class, 'deleteRunningPlan'])->name('api.posts.destroy');
    Route::post('/posts/{id}/join', [PostController::class, 'joinRunningPlan'])->name('api.posts.join');
    
    /*
    |--------------------------------------------------------------------------
    | COMMENTS MANAGEMENT
    |--------------------------------------------------------------------------
    */
    Route::post('/comments', [CommentController::class, 'store'])->name('api.comments.store');
    Route::put('/comments/{id}', [CommentController::class, 'update'])->name('api.comments.update');
    Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->name('api.comments.destroy');
    
    /*
    |--------------------------------------------------------------------------
    | CHALLENGES - USER ACTIONS
    |--------------------------------------------------------------------------
    */
    Route::post('/challenges/{id}/join', [ChallengeController::class, 'join'])->name('api.challenges.join');
    Route::delete('/challenges/{id}/leave', [ChallengeController::class, 'leave'])->name('api.challenges.leave');
    Route::put('/challenges/{id}/progress', [ChallengeController::class, 'updateProgress'])->name('api.challenges.progress');
    
    /*
    |--------------------------------------------------------------------------
    | RACES - USER ACTIONS
    |--------------------------------------------------------------------------
    */
    Route::post('/races/{id}/join', [RaceController::class, 'join'])->name('api.races.join');
    Route::delete('/races/{id}/leave', [RaceController::class, 'leave'])->name('api.races.leave');
    Route::post('/races/{id}/submit', [RaceController::class, 'submitResult'])->name('api.races.submit');
    
    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY ROUTES - CREATE, UPDATE, DELETE
    |--------------------------------------------------------------------------
    */
    
    // Challenges management (Admin only - controlled in controller)
    Route::post('/challenges', [ChallengeController::class, 'store'])->name('api.challenges.store');
    Route::put('/challenges/{id}', [ChallengeController::class, 'update'])->name('api.challenges.update');
    Route::delete('/challenges/{id}', [ChallengeController::class, 'destroy'])->name('api.challenges.destroy');
    
    // Races management (Admin only - controlled in controller)
    Route::post('/races', [RaceController::class, 'store'])->name('api.races.store');
    Route::put('/races/{id}', [RaceController::class, 'update'])->name('api.races.update');
    Route::delete('/races/{id}', [RaceController::class, 'destroy'])->name('api.races.destroy');

});

/*
|--------------------------------------------------------------------------
| PROTECTED TEST ROUTE
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'not.guest'])->get('/protected', function () {
    return response()->json(['message' => 'Access granted to registered users']);
})->name('api.protected');