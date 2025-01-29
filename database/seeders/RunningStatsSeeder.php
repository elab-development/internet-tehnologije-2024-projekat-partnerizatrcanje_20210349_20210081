<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RunningStatsSeeder extends Seeder
{
    public function run()
    {
        DB::table('running_stats')->insert([
            [
                'user_id' => 1,
                'total_distance' => 120.5, // u km
                'total_time' => 4500, // u sekundama (75 min)
                'average_pace' => 5.5, // min/km
                'runs_count' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'total_distance' => 250.3,
                'total_time' => 9200,
                'average_pace' => 5.2,
                'runs_count' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
