<?php

namespace App\Http\Controllers;

use App\Actions\Survey\GetPublicSurveyAction;
use App\Actions\Survey\SubmitSurveyAction;
use App\Http\Requests\Survey\SubmitSurveyRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    /**
     * Show the public survey form.
     */
    public function show(GetPublicSurveyAction $getPublicSurvey): Response
    {
        return Inertia::render('survey/index', [
            'survey' => $getPublicSurvey->execute(),
        ]);
    }

    /**
     * Store a submitted survey response.
     */
    public function submit(SubmitSurveyRequest $request, SubmitSurveyAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        if ($request->validated('redirect') === 'home') {
            return redirect()->route('home-page');
        }

        return redirect()->route('survey.show');
    }
}
