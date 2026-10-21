<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production') || SurveyResponse::withTrashed()->exists()) {
            return;
        }

        if (! Survey::where('is_active', true)->exists() || ! SurveyQuestion::exists()) {
            $this->call(SurveyQuestionSeeder::class);
        }

        $survey = Survey::where('is_active', true)
            ->latest()
            ->first();

        if (! $survey) {
            throw new RuntimeException('SurveySeeder membutuhkan survei aktif. Jalankan SurveyQuestionSeeder terlebih dahulu.');
        }

        $questions = $survey->questions()
            ->with(['options' => fn ($query) => $query->where('is_active', true)->orderBy('sequence_number')])
            ->where('is_active', true)
            ->orderBy('sequence_number')
            ->get();

        if ($questions->isEmpty()) {
            throw new RuntimeException('SurveySeeder membutuhkan pertanyaan survei yang aktif.');
        }

        DB::transaction(function () use ($survey, $questions) {
            $this->submissionDates()->each(
                fn (Carbon $createdAt) => $this->createResponse($survey, $questions, $createdAt)
            );
        });
    }

    /**
     * Build sample submission dates for the survey dashboard statistics.
     *
     * @return Collection<int, Carbon>
     */
    private function submissionDates(): Collection
    {
        $now = now();
        $minutesToday = $now->hour * 60 + $now->minute;

        $today = collect(range(1, 4))->map(
            fn () => $now->copy()
                ->startOfDay()
                ->addMinutes(random_int(0, $minutesToday))
        );

        $thisMonth = collect(range(1, 4))->map(
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

        $previousMonths = collect(range(1, 4))->map(
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
     * Create a single survey response with one answer per active question.
     *
     * @param  Collection<int, SurveyQuestion>  $questions
     */
    private function createResponse(Survey $survey, Collection $questions, Carbon $createdAt): void
    {
        $response = new SurveyResponse;
        $response->survey_id = $survey->id;
        $response->created_at = $createdAt;
        $response->updated_at = $createdAt;
        $response->save();

        $rows = [];

        foreach ($questions as $index => $question) {
            $timestamp = $createdAt->copy()->addSeconds($index);
            $option = $question->options->isNotEmpty() ? $question->options->random() : null;

            $rows[] = [
                'id' => (string) Str::orderedUuid(),
                'survey_response_id' => $response->id,
                'survey_question_id' => $question->id,
                'survey_question_option_id' => $option?->id,
                'custom_text' => $option === null
                    ? $this->textAnswer($question->label)
                    : ($option->is_allow_custom_text ? fake('id_ID')->sentence() : null),
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        SurveyAnswer::insert($rows);
    }

    /**
     * Build a sample text answer based on the question label.
     */
    private function textAnswer(string $label): string
    {
        return match ($label) {
            'Nama' => fake('id_ID')->name(),
            'Alamat/ Instansi' => fake('id_ID')->address(),
            default => fake('id_ID')->sentence(),
        };
    }
}
