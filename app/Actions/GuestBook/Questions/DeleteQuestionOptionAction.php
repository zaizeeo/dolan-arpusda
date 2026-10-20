<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestionOption;

class DeleteQuestionOptionAction
{
    /**
     * Soft delete a guest book question option.
     */
    public function execute(GuestBookQuestionOption $option): void
    {
        $option->delete();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(GuestBookQuestionOption $option): void
    {
        $this->execute($option);
    }
}
