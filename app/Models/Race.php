<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Race extends Model
{
    protected $fillable = [
        'name',
        'description',
        'race_date',        // Dan kada se trka održava
        'start_time',       // Vreme početka (npr. 09:00)
        'end_time',         // Vreme kraja (npr. 11:00)
        'distance',         // Distanca trke
        'prize',
        'max_participants', // Maksimalan broj učesnika
        'organizer_id'      // Admin organizator
    ];

    protected $casts = [
        'race_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_race')
               ->withPivot(['finish_time', 'completed_at', 'result_submitted'])
               ->withTimestamps();
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function isActive()
    {
        $now = now();
        $raceStart = $this->race_date->setTime(
            $this->start_time->hour, 
            $this->start_time->minute
        );
        $raceEnd = $this->race_date->setTime(
            $this->end_time->hour, 
            $this->end_time->minute
        );
        
        return $now->between($raceStart, $raceEnd);
    }

    public function canJoin()
    {
        return $this->race_date->isFuture() && 
               $this->participants()->count() < $this->max_participants;
    }
}