<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestion;

class UpdateSurveyQuestionAction
{
    /**
     * Update an existing survey question.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(SurveyQuestion $question, array $data): SurveyQuestion
    {
        $question->update([
            'label' => $data['label'] ?? $question->label,
            'description' => array_key_exists('description', $data) ? $data['description'] : $question->description,
            'is_active' => $data['is_active'] ?? $question->is_active,
        ]);

        return $question->refresh();
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(SurveyQuestion $question, array $data): SurveyQuestion
    {
        return $this->execute($question, $data);
    }
}
