<?php

namespace Database\Factories;

use App\Models\GuestBookQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GuestBookQuestion>
 */
class GuestBookQuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->word(),
            'text' => fake()->sentence(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the question is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
