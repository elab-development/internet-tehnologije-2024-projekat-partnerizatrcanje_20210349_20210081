<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition()
    {
        $role = $this->faker->randomElement(['user', 'admin']);

        return [
            'name' => $this->faker->firstName(),
            'surname' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password123'),
            'role' => $role,
            'running_stats' => json_encode([
                'total_distance' => $this->faker->randomFloat(2, 5, 100),
                'total_time' => $this->faker->randomFloat(2, 30, 300),
                'average_speed' => $this->faker->randomFloat(2, 5, 12)
            ]),
            'is_active' => true,
        ];
    }

    public function guest()
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'guest',
            'name' => null,
            'surname' => null,
            'email' => null,
            'password' => null,
            'running_stats' => null,
            'is_active' => false,
        ]);
    }

    public function admin()
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('adminpassword'),
        ]);
    }
}
