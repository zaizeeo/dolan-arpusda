<?php

namespace App\Http\Controllers;

use App\Models\GuestBook;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. Ringkasan Kunjungan
        $totalVisits = GuestBook::count();
        $todayVisits = GuestBook::whereDate('created_at', $today)->count();
        $yesterdayVisits = GuestBook::whereDate('created_at', $yesterday)->count();
        $weekVisits = GuestBook::where('created_at', '>=', $startOfWeek)->count();
        $monthVisits = GuestBook::where('created_at', '>=', $startOfMonth)->count();
        $activeQuestionsCount = GuestBookQuestion::where('is_active', true)->count();

        // Hitung persentase tren hari ini dibanding kemarin
        $todayTrend = 0;
        if ($yesterdayVisits > 0) {
            $todayTrend = round((($todayVisits - $yesterdayVisits) / $yesterdayVisits) * 100, 1);
        } elseif ($todayVisits > 0) {
            $todayTrend = 100;
        }

        // 2. Tren Kunjungan 7 Hari Terakhir
        $indonesianDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        $indonesianMonths = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
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

        // 3. Distribusi Pilihan Opsi Populer (Keperluan / Kategori Pengunjung)
        $popularOptions = GuestBookQuestionOption::with('question:id,label')
            ->withCount('answers')
            ->having('answers_count', '>', 0)
            ->orderByDesc('answers_count')
            ->limit(5)
            ->get()
            ->map(fn ($option) => [
                'id' => $option->id,
                'label' => $option->label,
                'question_label' => $option->question?->label,
                'count' => $option->answers_count,
            ]);

        // 4. Riwayat Kunjungan Terbaru (5 data terakhir)
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
                    'answers' => $guestBook->answers->map(fn ($a) => [
                        'id' => $a->id,
                        'question_label' => $a->question?->label,
                        'option_label' => $a->option?->label,
                        'custom_text' => $a->custom_text,
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
}
