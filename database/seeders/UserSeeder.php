<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        {
            // Kreiranje jednog admina
            User::factory()->admin()->create();
    
            // Kreiranje 10 običnih korisnika
            User::factory(10)->create(['role' => 'user']);
    
            // Kreiranje 5 guest korisnika
            User::factory(5)->guest()->create();
        }
    }
}
