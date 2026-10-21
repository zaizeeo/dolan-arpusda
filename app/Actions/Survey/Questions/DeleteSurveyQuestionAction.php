<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestion;
use Illuminate\Support\Facades\DB;

class DeleteSurveyQuestionAction
{
    /**
     * Soft delete a survey question together with its options.
     */
    public function execute(SurveyQuestion $question): void
    {
        DB::transaction(function () use ($question) {
            $question->options()->delete();
            $question->delete();
        });
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(SurveyQuestion $question): void
    {
        $this->execute($question);
    }
}
