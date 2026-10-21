<?php

namespace App\Http\Controllers;

use App\Actions\GuestBook\CreateGuestBookAction;
use App\Http\Requests\GuestBook\CreateGuestBookRequest;
use App\Models\GuestBook;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class GuestBookController extends Controller
{
    public function index(): Response
    {
        $guestBooks = GuestBook::with([
            'answers' => fn ($query) => $query->orderBy('created_at', 'asc'),
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
                    'answers' => $item->answers->map(fn ($answer) => [
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
            ->with(['options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc')])
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
            ->with(['options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number', 'asc')])
            ->get();

        return Inertia::render('home-page', compact('activeQuestions'));
    }

    /**
     * Show read-only guest book statistics.
     */
    public function statistics(): Response
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        $totalVisits = GuestBook::count();
        $todayVisits = GuestBook::whereDate('created_at', $today)->count();
        $yesterdayVisits = GuestBook::whereDate('created_at', $yesterday)->count();
        $weekVisits = GuestBook::where('created_at', '>=', $startOfWeek)->count();
        $monthVisits = GuestBook::where('created_at', '>=', $startOfMonth)->count();
        $activeQuestionsCount = GuestBookQuestion::where('is_active', true)->count();

        $todayTrend = 0;
        if ($yesterdayVisits > 0) {
            $todayTrend = round((($todayVisits - $yesterdayVisits) / $yesterdayVisits) * 100, 1);
        } elseif ($todayVisits > 0) {
            $todayTrend = 100;
        }

        $indonesianDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $indonesianMonths = [
            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'Mei',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Agu',
            9 => 'Sep',
            10 => 'Okt',
            11 => 'Nov',
            12 => 'Des',
        ];

        $sevenDaysTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = GuestBook::whereDate('created_at', $date)->count();
            $sevenDaysTrend[] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => $indonesianDays[$date->dayOfWeek],
                'short_date' => $date->day.' '.$indonesianMonths[$date->month],
                'count' => $count,
            ];
        }

        $popularOptions = GuestBookQuestionOption::with('question:id,label')
            ->withCount('answers')
            ->whereHas('answers')
            ->orderByDesc('answers_count')
            ->limit(5)
            ->get()
            ->map(fn ($option) => [
                'id' => $option->id,
                'label' => $option->label,
                'question_label' => $option->question?->label,
                'count' => $option->answers_count,
            ]);

        $recentVisits = GuestBook::with([
            'answers.question:id,label,sequence_number',
            'answers.option:id,label',
        ])
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($guestBook) {
                return [
                    'id' => $guestBook->id,
                    'created_at' => $guestBook->created_at?->toISOString(),
                    'created_at_human' => $guestBook->created_at?->diffForHumans(),
                    'answers' => $guestBook->answers->map(fn ($answer) => [
                        'id' => $answer->id,
                        'question_label' => $answer->question?->label,
                        'option_label' => $answer->option?->label,
                        'custom_text' => $answer->custom_text,
                    ]),
                ];
            });

        return Inertia::render('dashboard/index', [
            'stats' => [
                'total_visits' => $totalVisits,
                'today_visits' => $todayVisits,
                'yesterday_visits' => $yesterdayVisits,
                'today_trend' => $todayTrend,
                'week_visits' => $weekVisits,
                'month_visits' => $monthVisits,
                'active_questions_count' => $activeQuestionsCount,
            ],
            'trend' => $sevenDaysTrend,
            'popularOptions' => $popularOptions,
            'recentVisits' => $recentVisits,
        ]);
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
