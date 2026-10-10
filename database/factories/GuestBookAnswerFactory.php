<?php

namespace Database\Factories;

use App\Models\GuestBook;
use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GuestBookAnswer>
 */
class GuestBookAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'guest_book_id' => GuestBook::factory(),
            'guest_book_question_id' => GuestBookQuestion::factory(),
        ];
    }
}
