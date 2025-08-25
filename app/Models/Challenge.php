<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Challenge extends Model
{
    protected $fillable = [
        'name',
        'description', 
        'target_distance', // Ciljna distanca (npr. 30km)
        'duration_days',   // Trajanje u danima (npr. 30 dana)
        'start_date',      // Kada počinje izazov
        'end_date',        // Kada se završava
        'prize',           // Nagrada
        'created_by'       // Admin koji je kreirao
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_challenge')
               ->withPivot(['distance_completed', 'completed_at'])
               ->withTimestamps();
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function isActive()
    {
        return now()->between($this->start_date, $this->end_date);
    }
}