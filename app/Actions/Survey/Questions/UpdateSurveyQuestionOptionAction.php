<?php

namespace App\Actions\Survey\Questions;

use App\Models\SurveyQuestionOption;

class UpdateSurveyQuestionOptionAction
{
    /**
     * Update an existing survey question option.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(SurveyQuestionOption $option, array $data): SurveyQuestionOption
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
    public function __invoke(SurveyQuestionOption $option, array $data): SurveyQuestionOption
    {
        return $this->execute($option, $data);
    }
}
