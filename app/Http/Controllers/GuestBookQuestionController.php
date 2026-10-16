<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\Questions\CreateQuestionAction;
use App\Models\GuestBookQuestion;
use CreateQuestionRequest;
use Inertia\Inertia;

class GuestBookQuestionController extends Controller
{
    public function index()
    {
        $questions = GuestBookQuestion::with(['options' => fn($query) => $query->orderBy('sequence_number', 'asc')])->orderBy('sequence_number', 'asc')->get();
        return Inertia::render('dashboard/management/guest-book/question', ['questions' => $questions]);
    }

    public function create(CreateQuestionRequest $request, CreateQuestionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back();
    }
}
