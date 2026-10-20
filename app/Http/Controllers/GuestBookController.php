<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\CreateGuestBookAction;
use App\Http\Requests\GuestBook\CreateGuestBookRequest;
use App\Models\GuestBook;
use App\Models\GuestBookQuestion;
use Inertia\Inertia;
use Inertia\Response;

class GuestBookController extends Controller
{
    public function index(): Response
    {
        $guestBooks = GuestBook::with([
            'answers' => fn($query) => $query->orderBy('created_at', 'asc'),
            'answers.question:id,label,description,sequence_number',
            'answers.option:id,label,description,is_allow_custom_text',
        ])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'created_at' => $item->created_at?->toISOString(),
                    'created_at_human' => $item->created_at?->diffForHumans(),
                    'answers' => $item->answers->map(fn($answer) => [
                        'id' => $answer->id,
                        'guest_book_question_id' => $answer->guest_book_question_id,
                        'guest_book_question_option_id' => $answer->guest_book_question_option_id,
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
                ];
            });

        $activeQuestions = GuestBookQuestion::where('is_active', true)
            ->orderBy('sequence_number', 'asc')
            ->with(['options' => fn($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc')])
            ->get();

        $stats = [
            'total_visits' => GuestBook::count(),
            'today_visits' => GuestBook::whereDate('created_at', today())->count(),
            'month_visits' => GuestBook::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
        ];

        return Inertia::render('dashboard/management/guest-book/index', [
            'guestBooks' => $guestBooks,
            'activeQuestions' => $activeQuestions,
            'stats' => $stats,
        ]);
    }

    public function showGuestBookForm(): Response
    {
        $activeQuestions = GuestBookQuestion::where('is_active', true)
            ->orderBy('sequence_number', 'asc')
            ->with(['options' => fn($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc')])
            ->get();

        return Inertia::render('home-page', compact('activeQuestions'));
    }

    public function create(CreateGuestBookRequest $request, CreateGuestBookAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back();
    }

    public function destroy(GuestBook $guestBook)
    {
        $guestBook->answers()->delete();
        $guestBook->delete();

        return redirect()->back();
    }
}
