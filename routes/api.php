<?php

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
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\RunningStatsController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/guest-login', function () {
    // Kreiraj korisnika sa 'guest' rolom
    $guest = User::create([
        'name' => 'Gost', // Možeš promeniti ako želiš
        'surname' => 'Korisnik',
        'email' => 'guest_' . uniqid() . '@example.com', // Generišemo jedinstveni email
        'password' => bcrypt('guest123'), // Može ostati nebitan jer se ne koristi za login
        'role' => 'guest',
    ]);

    // Prijavi korisnika automatski
    Auth::login($guest);

    return response()->json([
        'message' => 'Uspešno ste prijavljeni kao gost!',
        'user' => $guest
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{id}', [PostController::class, 'deleteRunningPlan']);
    Route::post('/posts/{id}/join', [PostController::class, 'joinRunningPlan']);
    Route::get('/posts/filter', [PostController::class, 'filterRunningPlans']);
});


// Trke
Route::post('/races', [RaceController::class, 'store']);

// Izazovi
Route::post('/challenges', [ChallengeController::class, 'store']);

// Pridruživanje trci
Route::post('/races/{race}/join', [UserRaceController::class, 'joinRace']);


Route::apiResource('users', UserController::class);
Route::apiResource('posts', PostController::class);
Route::apiResource('comments', CommentController::class);

Route::get('/feed', [FeedController::class, 'index']);
Route::post('/reaction', [ReactionController::class, 'addReaction']);
Route::post('/comment', [ReactionController::class, 'addComment']);
Route::get('/stats/{user_id}', [RunningStatsController::class, 'getStats']);