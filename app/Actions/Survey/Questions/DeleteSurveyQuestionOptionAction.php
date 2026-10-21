<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestionOption;

class DeleteSurveyQuestionOptionAction
{
    /**
     * Soft delete a survey question option.
     */
    public function execute(SurveyQuestionOption $option): void
    {
        $option->delete();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(SurveyQuestionOption $option): void
    {
        $this->execute($option);
    }
}
