<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;
    use HasFactory;

    // Relacija: Post pripada korisniku
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relacija: Post ima više komentara
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
