<?php

namespace App\Actions\Survey;

use App\Models\Survey;

class GetPublicSurveyAction
{
    /**
     * Get the latest active survey formatted for the public survey form.
     *
     * @return array<string, mixed>|null
     */
    public function execute(): ?array
    {
        $survey = Survey::where('is_active', true)
            ->latest()
            ->with([
                'questions' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc'),
                'questions.options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc'),
            ])
            ->first();

        if (! $survey) {
            return null;
        }

        return [
            'id' => $survey->id,
            'title' => $survey->title,
            'description' => $survey->description,
            'questions' => $survey->questions->map(fn ($question) => [
                'id' => $question->id,
                'label' => $question->label,
                'description' => $question->description,
                'sequence_number' => $question->sequence_number,
                'options' => $question->options->map(fn ($option) => [
                    'id' => $option->id,
                    'label' => $option->label,
                    'description' => $option->description,
                    'is_allow_custom_text' => $option->is_allow_custom_text,
                    'sequence_number' => $option->sequence_number,
                ]),
            ]),
        ];
    }

    /**
     * Invokable alias for execute.
     *
     * @return array<string, mixed>|null
     */
    public function __invoke(): ?array
    {
        return $this->execute();
    }
}
