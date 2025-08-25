<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Generiši 10 korisnika
        User::factory(10)->create();

        // Generiši 10 postova (ako želiš povezivanje sa korisnicima, koristi ovo)
        Post::factory(10)->create();

        $this->call([
            RunningStatsSeeder::class,
        ]);

    }
}
