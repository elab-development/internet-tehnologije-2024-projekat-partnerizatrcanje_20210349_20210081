<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class; // Povezivanje sa modelom

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,  // Generiše naslov posta
            'body' => $this->faker->text, // Generiše telo posta
            'duration' => $this->faker->numberBetween(30, 120),  // Trajanje plana (u minutima)
            'frequency' => $this->faker->numberBetween(1, 7),  // Broj treninga nedeljno
            'distance' => $this->faker->randomFloat(2, 5, 100),  // Udaljenost u km
            'max_participants' => $this->faker->numberBetween(1, 100),  // Maksimalan broj učesnika
            'current_participants' => $this->faker->numberBetween(0, 100),  // Trenutni broj učesnika
            'user_id' => User::factory(),  // Kreira korisnika za post (ova linija automatski poziva fabriku User)
        ];
    }
}
