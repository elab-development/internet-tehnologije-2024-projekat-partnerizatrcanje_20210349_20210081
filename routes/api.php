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

// Javne rute (bez autentifikacije)
Route::post('/register', [AuthController::class, 'register'])->middleware('api');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/guest-login', function () {
    // Kreiraj korisnika sa 'guest' rolom
    $guest = User::create([
        'name' => 'Gost',
        'surname' => 'Korisnik',
        'email' => 'guest_' . uniqid() . '@example.com',
        'password' => bcrypt('guest123'),
        'role' => 'guest',
    ]);

    // Prijavi korisnika automatski
    Auth::login($guest);

    return response()->json([
        'message' => 'Uspešno ste prijavljeni kao gost!',
        'user' => $guest
    ]);
});

Route::get('/test-status', function() {
    return response()->json(['message' => 'Testing status code'], 201);
});

// Rute dostupne svim autentificiranim korisnicima (uključujući goste) - samo za pregled
Route::middleware('auth:sanctum')->group(function () {
    // Test ruta
    Route::get('/test-auth', function (Request $request) {
        return response()->json(['user' => $request->user(), 'message' => 'Uspešno autentifikovano']);
    });
    
    // Korisnički podaci
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/users/{id}/stats', [UserController::class, 'stats']);
    
    // Feed
    Route::get('/feed', [FeedController::class, 'index']);
    
    // Pregled postova
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::get('/posts/filter', [PostController::class, 'filterRunningPlans']);
    
    // Pregled komentara
    Route::get('/posts/{post_id}/comments', [CommentController::class, 'getCommentsByPost']);
    Route::get('/comments/{id}', [CommentController::class, 'show']);
    
    // Pregled trka i izazova
    Route::get('/races', [RaceController::class, 'index']);
    Route::get('/races/{id}', [RaceController::class, 'show']);
    Route::get('/challenges', [ChallengeController::class, 'index']);
    Route::get('/challenges/{id}', [ChallengeController::class, 'show']);
    
    // Odjava
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Rute dostupne samo registriranim korisnicima (ne i gostima) - za izmjene podataka
Route::middleware(['auth:sanctum', 'not.guest'])->group(function () {
    // Upravljanje korisničkim profilom
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);
    
    // Upravljanje postovima
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'deleteRunningPlan']);
    Route::post('/posts/{id}/join', [PostController::class, 'joinRunningPlan']);
    
    // Upravljanje komentarima
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    
    // Upravljanje trkama
    Route::post('/races', [RaceController::class, 'store']);
    Route::put('/races/{id}', [RaceController::class, 'update']);
    Route::delete('/races/{id}', [RaceController::class, 'destroy']);
    Route::post('/races/{raceId}/join', [UserRaceController::class, 'joinRace']);
    
    // Upravljanje izazovima
    Route::post('/challenges', [ChallengeController::class, 'store']);
    Route::put('/challenges/{id}', [ChallengeController::class, 'update']);
    Route::delete('/challenges/{id}', [ChallengeController::class, 'destroy']);
});
