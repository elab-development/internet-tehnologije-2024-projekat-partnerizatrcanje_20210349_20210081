<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'duration',
        'frequency',
        'distance',
        'max_participants',
        'current_participants',
        'user_id'
    ];

    // Vlasnik plana trčanja
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Učesnici plana trčanja
    public function participants()
    {
        return $this->belongsToMany(User::class, 'post_user', 'post_id', 'user_id');
    }

    
    public function comments(): HasMany {
        return $this->hasMany(Comment::class);
    }
    

}

