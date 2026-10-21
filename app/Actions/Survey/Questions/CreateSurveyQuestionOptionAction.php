<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;

class CreateSurveyQuestionOptionAction
{
    /**
     * Create a new option for an existing survey question.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(SurveyQuestion $question, array $data): SurveyQuestionOption
    {
        $lastSequence = $question->options()->max('sequence_number') ?? 0;

        return $question->options()->create([
            'label' => $data['label'],
            'description' => $data['description'] ?? null,
            'is_allow_custom_text' => $data['is_allow_custom_text'] ?? false,
            'sequence_number' => $lastSequence + 1,
        ]);
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(SurveyQuestion $question, array $data): SurveyQuestionOption
    {
        return $this->execute($question, $data);
    }
}
