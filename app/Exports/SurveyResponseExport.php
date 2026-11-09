<?php

namespace App\Exports;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Carbon\CarbonInterface;

class SurveyResponseExport extends AnswersExport
{
    public function __construct(?CarbonInterface $startDate = null, ?CarbonInterface $endDate = null)
    {
        $survey = Survey::where('is_active', true)->latest()->first();

        if (! $survey) {
            parent::__construct(['No', 'Tanggal'], collect(), 'Respon Survei');

            return;
        }

        $questions = SurveyQuestion::withTrashed()
            ->where('survey_id', $survey->id)
            ->orderBy('sequence_number')
            ->orderBy('label')
            ->get(['id', 'label', 'sequence_number']);

        $responses = SurveyResponse::query()
            ->where('survey_id', $survey->id)
            ->with(['answers.option:id,label'])
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate?->toDateString()))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate?->toDateString()))
            ->orderBy('created_at')
            ->get();

        $headings = ['No', 'Tanggal', ...$questions->pluck('label')->all()];

        $rows = $responses->values()->map(function (SurveyResponse $response, int $index) use ($questions): array {
            $answers = $response->answers->keyBy('survey_question_id');

            $values = $questions->map(function (SurveyQuestion $question) use ($answers): string {
                $answer = $answers->get($question->id);

                return $this->formatAnswer($answer?->option?->label, $answer?->custom_text);
            })->all();

            return [
                $index + 1,
                $response->created_at?->format('d/m/Y H:i'),
                ...$values,
            ];
        });

        parent::__construct($headings, $rows, 'Respon Survei');
    }
}
