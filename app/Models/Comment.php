<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    // Relacija: Comment pripada korisniku
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relacija: Comment pripada postu
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
