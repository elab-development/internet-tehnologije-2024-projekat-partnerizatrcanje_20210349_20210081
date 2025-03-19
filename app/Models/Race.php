<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Race extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'distance',
        'prize',
        'organizer_id'
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_race')->withTimestamps();
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }


     public function hasParticipant($userId): bool
    {
        return $this->participants()->where('user_id', $userId)->exists();
    }
}
