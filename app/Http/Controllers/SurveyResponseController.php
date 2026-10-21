<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SurveyResponseController extends Controller
{
    /**
     * Show survey responses for the active survey.
     */
    public function index(): Response
    {
        $survey = Survey::where('is_active', true)->latest()->first();

        if (! $survey) {
            return Inertia::render('dashboard/management/survey/index', [
                'survey' => null,
                'responses' => [],
                'stats' => $this->stats(null),
                'trend' => $this->weeklyTrend(null),
            ]);
        }

        $responses = SurveyResponse::where('survey_id', $survey->id)
            ->with([
                'answers' => fn ($query) => $query->orderBy('created_at', 'asc'),
                'answers.question:id,label,description,sequence_number',
                'answers.option:id,label,description,is_allow_custom_text',
            ])
            ->latest()
            ->get()
            ->map(fn ($response) => [
                'id' => $response->id,
                'created_at' => $response->created_at?->toISOString(),
                'created_at_human' => $response->created_at?->diffForHumans(),
                'answers' => $response->answers->map(fn ($answer) => [
                    'id' => $answer->id,
                    'survey_question_id' => $answer->survey_question_id,
                    'survey_question_option_id' => $answer->survey_question_option_id,
                    'custom_text' => $answer->custom_text,
                    'question' => $answer->question ? [
                        'id' => $answer->question->id,
                        'label' => $answer->question->label,
                        'description' => $answer->question->description,
                        'sequence_number' => $answer->question->sequence_number,
                    ] : null,
                    'option' => $answer->option ? [
                        'id' => $answer->option->id,
                        'label' => $answer->option->label,
                        'description' => $answer->option->description,
                        'is_allow_custom_text' => $answer->option->is_allow_custom_text,
                    ] : null,
                ]),
            ]);

        return Inertia::render('dashboard/management/survey/index', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
            ],
            'responses' => $responses,
            'stats' => $this->stats($survey),
            'trend' => $this->weeklyTrend($survey),
        ]);
    }

    /**
     * Show read-only survey response statistics.
     */
    public function statistics(): Response
    {
        $survey = Survey::where('is_active', true)->latest()->first();

        return Inertia::render('dashboard/survey-statistics', [
            'survey' => $survey ? [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
            ] : null,
            'stats' => $this->stats($survey),
            'trend' => $this->weeklyTrend($survey),
        ]);
    }

    /**
     * Build response statistic totals for the active survey.
     *
     * @return array{total_responses: int, today_responses: int, month_responses: int}
     */
    private function stats(?Survey $survey): array
    {
        if (! $survey) {
            return [
                'total_responses' => 0,
                'today_responses' => 0,
                'month_responses' => 0,
            ];
        }

        return [
            'total_responses' => SurveyResponse::where('survey_id', $survey->id)->count(),
            'today_responses' => SurveyResponse::where('survey_id', $survey->id)->whereDate('created_at', today())->count(),
            'month_responses' => SurveyResponse::where('survey_id', $survey->id)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];
    }

    /**
     * Build a seven-day response trend for the active survey.
     *
     * @return array<int, array{date: string, day_name: string, short_date: string, count: int}>
     */
    private function weeklyTrend(?Survey $survey): array
    {
        $dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        $startDate = today()->subDays(6);

        $counts = $survey
            ? SurveyResponse::where('survey_id', $survey->id)
                ->where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as response_date, COUNT(*) as total')
                ->groupBy('response_date')
                ->pluck('total', 'response_date')
            : collect();

        return collect(range(6, 0))
            ->map(function (int $daysAgo) use ($counts, $dayNames, $monthNames) {
                $date = today()->subDays($daysAgo);

                return [
                    'date' => $date->toDateString(),
                    'day_name' => $dayNames[$date->dayOfWeek],
                    'short_date' => $date->day.' '.$monthNames[$date->month],
                    'count' => (int) ($counts[$date->toDateString()] ?? 0),
                ];
            })
            ->all();
    }

    /**
     * Remove a survey response and its answers.
     */
    public function destroy(SurveyResponse $surveyResponse): RedirectResponse
    {
        $surveyResponse->answers()->delete();
        $surveyResponse->delete();

        return redirect()->back();
    }
}
