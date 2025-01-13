<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->firstName(),  // Generiše ime
            'surname' => $this->faker->lastName(),  // Generiše prezime
            'email' => $this->faker->unique()->safeEmail(),  // Generiše jedinstven email
            'password' => bcrypt('password123'),  // Postavlja šifru kao bcrypt
            'running_stats' => json_encode([  // Ovo je primer generisanja podataka za 'running_stats'
                'total_distance' => $this->faker->randomFloat(2, 5, 100),  // Ukupna pretrčana udaljenost
                'total_time' => $this->faker->randomFloat(2, 30, 300),  // Ukupno vreme provedeno u trčanju
                'average_speed' => $this->faker->randomFloat(2, 5, 12)  // Prosečna brzina
            ]),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
