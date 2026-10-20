<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestion;

class ToggleQuestionActiveAction
{
    /**
     * Toggle the active state of a guest book question.
     */
    public function execute(GuestBookQuestion $question): GuestBookQuestion
    {
        $question->update([
            'is_active' => ! $question->is_active,
        ]);

        return $question->refresh();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(GuestBookQuestion $question): GuestBookQuestion
    {
        return $this->execute($question);
    }
}
