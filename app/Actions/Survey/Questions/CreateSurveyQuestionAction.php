<?php

namespace App\Actions\Survey\Questions;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateSurveyQuestionAction
{
    /**
     * Create a new survey question together with its options.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(Survey $survey, array $data): SurveyQuestion
    {
        return DB::transaction(function () use ($survey, $data) {
            $question = $survey->questions()->create([
                'label' => $data['label'],
                'description' => $data['description'] ?? null,
                'sequence_number' => ($survey->questions()->max('sequence_number') ?? 0) + 1,
            ]);

            $options = $data['options'] ?? [];

            if (count($options) > 0) {
                $now = now();

                $rows = array_map(
                    function ($option, $index) use ($question, $now) {
                        return [
                            'id' => (string) Str::orderedUuid(),
                            'survey_question_id' => $question->id,
                            'label' => $option['label'],
                            'description' => $option['description'] ?? null,
                            'is_allow_custom_text' => $option['is_allow_custom_text'] ?? false,
                            'sequence_number' => $index + 1,
                            'is_active' => true,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    },
                    $options,
                    array_keys($options)
                );

                SurveyQuestionOption::insert($rows);
            }

            return $question;
        });
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(Survey $survey, array $data): SurveyQuestion
    {
        return $this->execute($survey, $data);
    }
}
