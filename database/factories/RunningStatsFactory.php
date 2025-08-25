<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\RunningStats;

class RunningStatsFactory extends Factory
{
    protected $model = RunningStats::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'total_distance' => $this->faker->randomFloat(2, 0, 500),
            'total_time' => $this->faker->numberBetween(1000, 50000),
            'average_pace' => $this->faker->randomFloat(2, 3, 8),
            'runs_count' => $this->faker->numberBetween(1, 100),
        ];
    }
}
