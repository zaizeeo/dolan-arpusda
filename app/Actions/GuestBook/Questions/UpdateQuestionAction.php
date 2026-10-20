<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestion;

class UpdateQuestionAction
{
    /**
     * Update an existing guest book question.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(GuestBookQuestion $question, array $data): GuestBookQuestion
    {
        $question->update([
            'label' => $data['label'] ?? $question->label,
            'description' => array_key_exists('description', $data) ? $data['description'] : $question->description,
            'is_active' => $data['is_active'] ?? $question->is_active,
        ]);

        return $question->refresh();
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(GuestBookQuestion $question, array $data): GuestBookQuestion
    {
        return $this->execute($question, $data);
    }
}
