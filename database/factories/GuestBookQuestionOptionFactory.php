<?php

namespace Database\Factories;

use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GuestBookQuestionOption>
 */
class GuestBookQuestionOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'guest_book_question_id' => GuestBookQuestion::factory(),
            'label' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
