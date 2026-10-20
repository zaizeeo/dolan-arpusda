<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestionOption;

class UpdateQuestionOptionAction
{
    /**
     * Update an existing guest book question option.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(GuestBookQuestionOption $option, array $data): GuestBookQuestionOption
    {
        $option->update([
            'label' => $data['label'] ?? $option->label,
            'description' => array_key_exists('description', $data) ? $data['description'] : $option->description,
            'is_allow_custom_text' => $data['is_allow_custom_text'] ?? $option->is_allow_custom_text,
        ]);

        return $option->refresh();
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(GuestBookQuestionOption $option, array $data): GuestBookQuestionOption
    {
        return $this->execute($option, $data);
    }
}
