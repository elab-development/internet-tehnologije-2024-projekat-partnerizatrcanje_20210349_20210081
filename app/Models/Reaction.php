<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reaction extends Model
{
    use HasFactory;

    /**
     * Masovno dodeljiva polja.
     */
    protected $fillable = [
        'user_id',
        'post_id',
        'type',   // 'emoji' ili 'comment'
        'content' // Emodži kod ili tekst komentara
    ];

    /**
     * Relacija: Reakcija pripada korisniku.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacija: Reakcija pripada objavi.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
