<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\Questions\CreateQuestionAction;
use App\Actions\GuestBook\Questions\CreateQuestionOptionAction;
use App\Actions\GuestBook\Questions\DeleteQuestionAction;
use App\Actions\GuestBook\Questions\DeleteQuestionOptionAction;
use App\Actions\GuestBook\Questions\ToggleQuestionActiveAction;
use App\Actions\GuestBook\Questions\ToggleQuestionOptionActiveAction;
use App\Actions\GuestBook\Questions\UpdateQuestionAction;
use App\Actions\GuestBook\Questions\UpdateQuestionOptionAction;
use App\Http\Requests\GuestBook\Questions\CreateQuestionOptionRequest;
use App\Http\Requests\GuestBook\Questions\CreateQuestionRequest;
use App\Http\Requests\GuestBook\Questions\UpdateQuestionOptionRequest;
use App\Http\Requests\GuestBook\Questions\UpdateQuestionRequest;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Inertia\Inertia;

class GuestBookQuestionController extends Controller
{
    public function index()
    {
        $questions = GuestBookQuestion::with(['options' => fn ($query) => $query->orderBy('sequence_number', 'asc')])
            ->orderBy('sequence_number', 'asc')
            ->get();

        return Inertia::render('dashboard/management/guest-book/question', ['questions' => $questions]);
    }

    public function create(CreateQuestionRequest $request, CreateQuestionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back();
    }

    public function update(UpdateQuestionRequest $request, GuestBookQuestion $guestBookQuestion, UpdateQuestionAction $action)
    {
        $action->execute($guestBookQuestion, $request->validated());

        return redirect()->back();
    }

    public function destroy(GuestBookQuestion $guestBookQuestion, DeleteQuestionAction $action)
    {
        $action->execute($guestBookQuestion);

        return redirect()->back();
    }

    public function toggleActive(GuestBookQuestion $guestBookQuestion, ToggleQuestionActiveAction $action)
    {
        $action->execute($guestBookQuestion);

        return redirect()->back();
    }

    public function createOption(CreateQuestionOptionRequest $request, GuestBookQuestion $guestBookQuestion, CreateQuestionOptionAction $action)
    {
        $action->execute($guestBookQuestion, $request->validated());

        return redirect()->back();
    }

    public function updateOption(UpdateQuestionOptionRequest $request, GuestBookQuestionOption $guestBookQuestionOption, UpdateQuestionOptionAction $action)
    {
        $action->execute($guestBookQuestionOption, $request->validated());

        return redirect()->back();
    }

    public function destroyOption(GuestBookQuestionOption $guestBookQuestionOption, DeleteQuestionOptionAction $action)
    {
        $action->execute($guestBookQuestionOption);

        return redirect()->back();
    }

    public function toggleOptionActive(GuestBookQuestionOption $guestBookQuestionOption, ToggleQuestionOptionActiveAction $action)
    {
        $action->execute($guestBookQuestionOption);

        return redirect()->back();
    }
}
