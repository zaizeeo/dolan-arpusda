<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestion;
use Illuminate\Support\Facades\DB;

class DeleteQuestionAction
{
    /**
     * Soft delete a guest book question together with its options.
     */
    public function execute(GuestBookQuestion $question): void
    {
        DB::transaction(function () use ($question) {
            $question->options()->delete();
            $question->delete();
        });
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(GuestBookQuestion $question): void
    {
        $this->execute($question);
    }
}
