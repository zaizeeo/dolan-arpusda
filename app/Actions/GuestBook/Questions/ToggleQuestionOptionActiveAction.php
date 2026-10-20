<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestionOption;

class ToggleQuestionOptionActiveAction
{
    /**
     * Toggle the active state of a guest book question option.
     */
    public function execute(GuestBookQuestionOption $option): GuestBookQuestionOption
    {
        $option->update([
            'is_active' => ! $option->is_active,
        ]);

        return $option->refresh();
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(GuestBookQuestionOption $option): GuestBookQuestionOption
    {
        return $this->execute($option);
    }
}
