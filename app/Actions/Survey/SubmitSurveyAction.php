<?php

namespace App\Actions\Survey;

use App\Models\SurveyAnswer;
use App\Models\SurveyResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubmitSurveyAction
{
    /**
     * Store a survey response together with its answers.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): SurveyResponse
    {
        return DB::transaction(function () use ($data) {
            $response = SurveyResponse::create([
                'survey_id' => $data['survey_id'],
            ]);

            $now = now();

            $answers = array_map(function ($answer) use ($response, $now) {
                return [
                    'id' => (string) Str::orderedUuid(),
                    'survey_response_id' => $response->id,
                    'survey_question_id' => $answer['survey_question_id'],
                    'survey_question_option_id' => ! empty($answer['survey_question_option_id'])
                        ? $answer['survey_question_option_id']
                        : null,
                    'custom_text' => (isset($answer['custom_text']) && trim($answer['custom_text']) !== '')
                        ? $answer['custom_text']
                        : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $data['answers']);

            SurveyAnswer::insert($answers);

            return $response;
        });
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data): SurveyResponse
    {
        return $this->execute($data);
    }
}
