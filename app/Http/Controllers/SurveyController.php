<?php

namespace App\Http\Controllers;

use App\Actions\Survey\SubmitSurveyAction;
use App\Http\Requests\Survey\SubmitSurveyRequest;
use App\Models\Survey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    /**
     * Show the public survey form.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $unlocked = $request->session()->get('survey_unlocked', false)
            || ($request->user()?->hasAdminsAuthority() ?? false);

        if (! $unlocked) {
            return redirect()->route('home-page');
        }

        $survey = Survey::where('is_active', true)
            ->latest()
            ->with([
                'questions' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc'),
                'questions.options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc'),
            ])
            ->first();

        return Inertia::render('survey/index', [
            'survey' => $survey ? [
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
            ] : null,
        ]);
    }

    /**
     * Store a submitted survey response.
     */
    public function submit(SubmitSurveyRequest $request, SubmitSurveyAction $action): RedirectResponse
    {
        $unlocked = $request->session()->get('survey_unlocked', false)
            || ($request->user()?->hasAdminsAuthority() ?? false);

        if (! $unlocked) {
            return redirect()->route('home-page');
        }

        $action->execute($request->validated());

        $request->session()->put('survey_submitted', true);

        return redirect()->route('survey.show');
    }
}
