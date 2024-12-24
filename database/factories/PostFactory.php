<?php

namespace Database\Factories;

use App\Models\Post;
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
            'title' => $this->faker->sentence, // Primer atributa
            'body' => $this->faker->paragraph,
            'user_id' => \App\Models\User::factory(), // Veza sa drugim modelom
        ];
    }
}
