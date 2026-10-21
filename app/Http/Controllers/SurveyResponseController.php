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
                'stats' => [
                    'total_responses' => 0,
                    'today_responses' => 0,
                    'month_responses' => 0,
                ],
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
            'stats' => [
                'total_responses' => SurveyResponse::where('survey_id', $survey->id)->count(),
                'today_responses' => SurveyResponse::where('survey_id', $survey->id)->whereDate('created_at', today())->count(),
                'month_responses' => SurveyResponse::where('survey_id', $survey->id)
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],
        ]);
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
