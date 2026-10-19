<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\CreateGuestBookAction;
use App\Http\Requests\GuestBook\CreateGuestBookRequest;
use App\Models\GuestBook;
use App\Models\GuestBookQuestion;
use Inertia\Inertia;

class GuestBookController extends Controller
{
    public function index()
    {
        $guestBooks = GuestBook::with(['questions.options', 'answers.option'])->get();
        return Inertia::render("dashboard/management/guest-book/index", compact("guestBooks", "activeQuestionCount"));
    }

    public function showGuestBookForm()
    {
        $activeQuestions = GuestBookQuestion::where('is_active', true)->orderBy('sequence_number', 'asc')->with(['options' => fn($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc')])->get();
        return Inertia::render('home-page', compact('activeQuestions'));
    }

    public function create(CreateGuestBookRequest $request, CreateGuestBookAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back();
    }
}
