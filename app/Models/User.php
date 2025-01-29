<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Relacija: User ima više postova.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Relacija: User ima više komentara.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Relacija: User učestvuje u više trka.
     */
    public function races(): BelongsToMany
    {
        return $this->belongsToMany(Race::class, 'user_race')->withTimestamps();
    }

    /**
     * Relacija: User učestvuje u više izazova.
     */
    public function challenges(): BelongsToMany
    {
        return $this->belongsToMany(Challenge::class, 'user_challenge')->withTimestamps();
    }

    /**
     * Relacija: User ima više statističkih podataka o trčanju.
     */
  

    public function runningStats()
    {
        return $this->hasOne(RunningStats::class);
    }
    

}

