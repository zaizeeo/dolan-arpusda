<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;

class CreateQuestionOptionAction
{
    /**
     * Create a new option for an existing guest book question.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(GuestBookQuestion $question, array $data): GuestBookQuestionOption
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
    public function __invoke(GuestBookQuestion $question, array $data): GuestBookQuestionOption
    {
        return $this->execute($question, $data);
    }
}
