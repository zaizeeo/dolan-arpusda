<?php

namespace App\Http\Controllers;

use App\Actions\Survey\Questions\CreateSurveyQuestionAction;
use App\Actions\Survey\Questions\CreateSurveyQuestionOptionAction;
use App\Actions\Survey\Questions\DeleteSurveyQuestionAction;
use App\Actions\Survey\Questions\DeleteSurveyQuestionOptionAction;
use App\Actions\Survey\Questions\ToggleSurveyQuestionActiveAction;
use App\Actions\Survey\Questions\ToggleSurveyQuestionOptionActiveAction;
use App\Actions\Survey\Questions\UpdateSurveyQuestionAction;
use App\Actions\Survey\Questions\UpdateSurveyQuestionOptionAction;
use App\Actions\SwapSequenceAction;
use App\Http\Requests\MoveSequenceRequest;
use App\Http\Requests\Survey\Questions\CreateSurveyQuestionOptionRequest;
use App\Http\Requests\Survey\Questions\CreateSurveyQuestionRequest;
use App\Http\Requests\Survey\Questions\UpdateSurveyQuestionOptionRequest;
use App\Http\Requests\Survey\Questions\UpdateSurveyQuestionRequest;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SurveyQuestionController extends Controller
{
    /**
     * Show the question management page for the active survey.
     */
    public function index(): Response
    {
        $survey = Survey::where('is_active', true)->latest()->first();

        if (! $survey) {
            return Inertia::render('dashboard/management/survey/question', [
                'survey' => null,
                'questions' => [],
            ]);
        }

        $questions = $survey->questions()
            ->with([
                'options' => fn ($query) => $query
                    ->orderBy('sequence_number')
                    ->orderBy('created_at')
                    ->orderBy('id'),
            ])
            ->orderBy('sequence_number')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        return Inertia::render('dashboard/management/survey/question', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
            ],
            'questions' => $questions,
        ]);
    }

    public function create(CreateSurveyQuestionRequest $request, CreateSurveyQuestionAction $action): RedirectResponse
    {
        $survey = Survey::where('is_active', true)->latest()->firstOrFail();

        $action->execute($survey, $request->validated());

        return redirect()->back();
    }

    public function update(UpdateSurveyQuestionRequest $request, SurveyQuestion $surveyQuestion, UpdateSurveyQuestionAction $action): RedirectResponse
    {
        $action->execute($surveyQuestion, $request->validated());

        return redirect()->back();
    }

    public function destroy(SurveyQuestion $surveyQuestion, DeleteSurveyQuestionAction $action): RedirectResponse
    {
        $action->execute($surveyQuestion);

        return redirect()->back();
    }

    public function toggleActive(SurveyQuestion $surveyQuestion, ToggleSurveyQuestionActiveAction $action): RedirectResponse
    {
        $action->execute($surveyQuestion);

        return redirect()->back();
    }

    public function moveSequence(MoveSequenceRequest $request, SurveyQuestion $surveyQuestion, SwapSequenceAction $action): RedirectResponse
    {
        $action->execute(
            $surveyQuestion,
            (string) $request->validated('direction'),
            'survey_id'
        );

        return redirect()->back();
    }

    public function createOption(CreateSurveyQuestionOptionRequest $request, SurveyQuestion $surveyQuestion, CreateSurveyQuestionOptionAction $action): RedirectResponse
    {
        $action->execute($surveyQuestion, $request->validated());

        return redirect()->back();
    }

    public function updateOption(UpdateSurveyQuestionOptionRequest $request, SurveyQuestionOption $surveyQuestionOption, UpdateSurveyQuestionOptionAction $action): RedirectResponse
    {
        $action->execute($surveyQuestionOption, $request->validated());

        return redirect()->back();
    }

    public function destroyOption(SurveyQuestionOption $surveyQuestionOption, DeleteSurveyQuestionOptionAction $action): RedirectResponse
    {
        $action->execute($surveyQuestionOption);

        return redirect()->back();
    }

    public function toggleOptionActive(SurveyQuestionOption $surveyQuestionOption, ToggleSurveyQuestionOptionActiveAction $action): RedirectResponse
    {
        $action->execute($surveyQuestionOption);

        return redirect()->back();
    }

    public function moveOptionSequence(MoveSequenceRequest $request, SurveyQuestionOption $surveyQuestionOption, SwapSequenceAction $action): RedirectResponse
    {
        $action->execute(
            $surveyQuestionOption,
            (string) $request->validated('direction'),
            'survey_question_id'
        );

        return redirect()->back();
    }
}
