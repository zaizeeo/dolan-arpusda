<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\Questions\CreateQuestionAction;
use App\Models\GuestBookQuestion;
use App\Http\Requests\GuestBook\Questions\CreateQuestionRequest;
use Illuminate\Support\Facades\Log;
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
        $data = $request->validated();
        $action->execute($data);
        // Log::info($data);
        return redirect()->back();
    }
}
