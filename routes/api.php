<?php

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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    // Dodajte ovde druge zaštićene rute po potrebi.
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