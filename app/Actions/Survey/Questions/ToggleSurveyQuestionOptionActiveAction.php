<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestionOption;

class ToggleSurveyQuestionOptionActiveAction
{
    /**
     * Toggle the active state of a survey question option.
     */
    public function execute(SurveyQuestionOption $option): SurveyQuestionOption
    {
        $option->update([
            'is_active' => ! $option->is_active,
        ]);

        return $option->refresh();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(SurveyQuestionOption $option): SurveyQuestionOption
    {
        return $this->execute($option);
    }
}
