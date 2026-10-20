<?php

namespace Database\Seeders;

use App\Models\GuestBook;
use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class GuestBookSeeder extends Seeder
{
    /**
     * Questions that every seeded guest book must answer.
     *
     * @var array<int, string>
     */
    private const REQUIRED_QUESTIONS = [
        'Nama',
        'Jenis Kelamin',
        'Pendidikan Terakhir',
        'Pekerjaan',
        'Alamat',
        'Keperluan Layanan',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production') || GuestBook::withTrashed()->exists()) {
            return;
        }

        if (! GuestBookQuestion::exists()) {
            $this->call(GuestBookQuestionSeeder::class);
        }

        $questions = GuestBookQuestion::query()
            ->with(['options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number')])
            ->orderBy('sequence_number')
            ->get()
            ->keyBy('label');

        $this->ensureQuestionsExist($questions);

        $dates = $this->submissionDates();

        DB::transaction(function () use ($questions, $dates) {
            $dates->each(fn (Carbon $createdAt) => $this->createGuestBook($questions, $createdAt));
        });
    }

    /**
     * Ensure the seeded questions are still available before creating answers.
     *
     * @param  Collection<string, GuestBookQuestion>  $questions
     */
    private function ensureQuestionsExist(Collection $questions): void
    {
        $missingQuestions = collect(self::REQUIRED_QUESTIONS)
            ->reject(fn (string $label) => $questions->has($label));

        if ($missingQuestions->isNotEmpty()) {
            throw new RuntimeException(
                'GuestBookSeeder membutuhkan pertanyaan berikut: '.$missingQuestions->implode(', ')
            );
        }
    }

    /**
     * Build a spread of submission dates so the dashboard statistics are populated.
     *
     * @return Collection<int, Carbon>
     */
    private function submissionDates(): Collection
    {
        $now = now();
        $minutesToday = $now->hour * 60 + $now->minute;

        $today = collect(range(1, 8))->map(
            fn () => $now->copy()
                ->startOfDay()
                ->addMinutes(random_int(0, $minutesToday))
        );

        $thisMonth = collect(range(1, 8))->map(
            function () use ($now) {
                $date = $now->copy()
                    ->startOfMonth()
                    ->addDays(random_int(0, max(0, $now->day - 1)))
                    ->setTime(random_int(8, 15), random_int(0, 59));

                return $date->isFuture()
                    ? $now->copy()->subMinutes(random_int(0, min(60, $now->hour * 60 + $now->minute)))
                    : $date;
            }
        );

        $previousMonths = collect(range(1, 8))->map(
            fn () => $now->copy()
                ->subMonths(random_int(1, 4))
                ->startOfMonth()
                ->addDays(random_int(0, 25))
                ->setTime(random_int(8, 15), random_int(0, 59))
        );

        return $today
            ->merge($thisMonth)
            ->merge($previousMonths)
            ->sortBy(fn (Carbon $date) => $date->getTimestamp())
            ->values();
    }

    /**
     * Create a single guest book entry with one answer per required question.
     *
     * @param  Collection<string, GuestBookQuestion>  $questions
     */
    private function createGuestBook(Collection $questions, Carbon $createdAt): void
    {
        $guestBook = GuestBook::create([
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        $rows = [];

        foreach ($this->buildAnswers($questions) as $index => $answer) {
            $timestamp = $createdAt->copy()->addSeconds($index);

            $rows[] = [
                'id' => (string) Str::orderedUuid(),
                'guest_book_id' => $guestBook->id,
                'guest_book_question_id' => $answer['guest_book_question_id'],
                'guest_book_question_option_id' => $answer['guest_book_question_option_id'] ?? null,
                'custom_text' => $answer['custom_text'] ?? null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        GuestBookAnswer::insert($rows);
    }

    /**
     * Build the answers for a guest book entry.
     *
     * @param  Collection<string, GuestBookQuestion>  $questions
     * @return array<int, array{guest_book_question_id: string, guest_book_question_option_id?: string|null, custom_text?: string|null}>
     */
    private function buildAnswers(Collection $questions): array
    {
        $job = $this->randomOption($questions['Pekerjaan']);
        $need = $this->randomOption($questions['Keperluan Layanan']);

        return [
            [
                'guest_book_question_id' => $questions['Nama']->id,
                'custom_text' => fake('id_ID')->name(),
            ],
            [
                'guest_book_question_id' => $questions['Jenis Kelamin']->id,
                'guest_book_question_option_id' => $this->randomOption($questions['Jenis Kelamin'])->id,
            ],
            [
                'guest_book_question_id' => $questions['Pendidikan Terakhir']->id,
                'guest_book_question_option_id' => $this->randomOption($questions['Pendidikan Terakhir'])->id,
            ],
            [
                'guest_book_question_id' => $questions['Pekerjaan']->id,
                'guest_book_question_option_id' => $job->id,
                'custom_text' => $job->is_allow_custom_text
                    ? fake()->randomElement(['Wirausaha', 'Freelancer', 'Petani', 'Nelayan', 'Driver Ojek Online'])
                    : null,
            ],
            [
                'guest_book_question_id' => $questions['Alamat']->id,
                'custom_text' => fake('id_ID')->address(),
            ],
            [
                'guest_book_question_id' => $questions['Keperluan Layanan']->id,
                'guest_book_question_option_id' => $need->id,
                'custom_text' => $need->is_allow_custom_text
                    ? fake()->randomElement(['Konsultasi koleksi daerah', 'Studi banding', 'Penelitian arsip', 'Donasi koleksi'])
                    : null,
            ],
        ];
    }

    /**
     * Pick a random active option from the given question.
     */
    private function randomOption(GuestBookQuestion $question): GuestBookQuestionOption
    {
        $options = $question->options->where('is_active', true)->values();

        if ($options->isEmpty()) {
            throw new RuntimeException("Pertanyaan \"{$question->label}\" tidak memiliki opsi aktif.");
        }

        return $options->random();
    }
}
