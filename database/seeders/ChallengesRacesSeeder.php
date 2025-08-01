<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Challenge;
use App\Models\Race;
use App\Models\User;
use Carbon\Carbon;

class ChallengesRacesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pronađi prvi admin korisnika ili kreiraj ga
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin',
                'surname' => 'Administrator',
                'email' => 'admin@sprintlink.com',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'is_active' => true,
            ]);
        }

        // Kreiraj test izazove
        $challenges = [
            [
                'name' => 'Adidas 30km mesečni izazov',
                'description' => 'Istrči 30 kilometara u toku mesec dana. Možeš trčati kada god želiš!',
                'target_distance' => 30.00,
                'duration_days' => 30,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(30),
                'prize' => 'Adidas majica i vaučer od 20€',
                'created_by' => $admin->id,
            ],
            [
                'name' => 'Nike 50km jesenjи izazov',
                'description' => 'Autumn challenge - istrči 50km u toku 45 dana kroz jesen.',
                'target_distance' => 50.00,
                'duration_days' => 45,
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(50),
                'prize' => 'Nike patike i duks',
                'created_by' => $admin->id,
            ],
            [
                'name' => 'Puma Sprint izazov',
                'description' => 'Kratki ali intenzivan - 15km za 2 nedelje!',
                'target_distance' => 15.00,
                'duration_days' => 14,
                'start_date' => Carbon::now()->addDays(1),
                'end_date' => Carbon::now()->addDays(15),
                'prize' => 'Puma trenerka',
                'created_by' => $admin->id,
            ],
        ];

        foreach ($challenges as $challengeData) {
            Challenge::create($challengeData);
        }

        // Kreiraj test trke
        $races = [
            [
                'name' => 'Adidas 5km jutarnja trka',
                'description' => 'Brza jutarnja trka od 5km. Startujemo tačno u 9h!',
                'race_date' => Carbon::now()->addDays(7),
                'start_time' => '09:00:00',
                'end_time' => '11:00:00',
                'distance' => 5.00,
                'max_participants' => 100,
                'prize' => 'Adidas patike za prva 3 mesta',
                'organizer_id' => $admin->id,
            ],
            [
                'name' => 'Nike 10km večernja trka',
                'description' => 'Večernja trka kroz grad. Idealno za kraj dana!',
                'race_date' => Carbon::now()->addDays(14),
                'start_time' => '18:00:00',
                'end_time' => '20:30:00',
                'distance' => 10.00,
                'max_participants' => 75,
                'prize' => 'Nike oprema za top 5',
                'organizer_id' => $admin->id,
            ],
            [
                'name' => 'Puma polumaraton',
                'description' => 'Izazovni polumaraton za iskusne trkače. Registracija obavezna!',
                'race_date' => Carbon::now()->addDays(21),
                'start_time' => '07:00:00',
                'end_time' => '12:00:00',
                'distance' => 21.10,
                'max_participants' => 50,
                'prize' => 'Puma sportska oprema + medalje',
                'organizer_id' => $admin->id,
            ],
        ];

        foreach ($races as $raceData) {
            Race::create($raceData);
        }

        $this->command->info('Challenges and Races seeded successfully!');
    }
}