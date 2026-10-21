<?php

namespace Database\Factories;

use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyQuestionOption>
 */
class SurveyQuestionOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'survey_question_id' => SurveyQuestion::factory(),
            'label' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'is_active' => true,
            'is_allow_custom_text' => false,
            'sequence_number' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Indicate that the option allows custom text.
     */
    public function allowsCustomText(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_allow_custom_text' => true,
        ]);
    }
}
