<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RunningStats extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'total_distance', 
        'total_time', 
        'average_pace', 
        'runs_count'
    ];

    /**
     * Relacija: Svaka statistika pripada jednom korisniku.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
