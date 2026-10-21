<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestion;

class ToggleSurveyQuestionActiveAction
{
    /**
     * Toggle the active state of a survey question.
     */
    public function execute(SurveyQuestion $question): SurveyQuestion
    {
        $question->update([
            'is_active' => ! $question->is_active,
        ]);

        return $question->refresh();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(SurveyQuestion $question): SurveyQuestion
    {
        return $this->execute($question);
    }
}
