<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'duration',
        'distance',
        'prize',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_challenge')->withTimestamps();
    }

}

