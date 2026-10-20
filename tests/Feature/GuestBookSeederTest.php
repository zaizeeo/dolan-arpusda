<?php

namespace Tests\Feature;

use App\Models\GuestBook;
use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Database\Seeders\GuestBookQuestionSeeder;
use Database\Seeders\GuestBookSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestBookSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_questions_and_guest_books(): void
    {
        $this->seed();

        $this->assertSame(6, GuestBookQuestion::count());
        $this->assertSame(27, GuestBookQuestionOption::count());
        $this->assertSame(24, GuestBook::count());
        $this->assertSame(24 * 6, GuestBookAnswer::count());
    }

    public function test_guest_book_seeder_creates_questions_when_called_standalone(): void
    {
        $this->seed(GuestBookSeeder::class);

        $this->assertSame(6, GuestBookQuestion::count());
        $this->assertSame(24, GuestBook::count());
    }

    public function test_each_guest_book_answers_every_question_in_sequence_order(): void
    {
        $this->seed();

        GuestBook::with('answers.question')->get()->each(function (GuestBook $guestBook) {
            $this->assertCount(6, $guestBook->answers);

            $sequences = $guestBook->answers
                ->map(fn (GuestBookAnswer $answer) => $answer->question->sequence_number)
                ->all();

            $sortedSequences = $sequences;
            sort($sortedSequences);

            $this->assertSame($sortedSequences, $sequences);
        });
    }

    public function test_answers_match_the_question_and_option_semantics(): void
    {
        $this->seed();

        GuestBookAnswer::with(['question', 'option'])->get()->each(function (GuestBookAnswer $answer) {
            if (in_array($answer->question->label, ['Nama', 'Alamat'], true)) {
                $this->assertNull($answer->guest_book_question_option_id);
                $this->assertNotNull($answer->custom_text);

                return;
            }

            $this->assertNotNull($answer->guest_book_question_option_id);
            $this->assertNotNull($answer->option);

            if ($answer->option->is_allow_custom_text) {
                $this->assertNotNull($answer->custom_text);
            } else {
                $this->assertNull($answer->custom_text);
            }
        });
    }

    public function test_seeded_guest_books_populate_the_dashboard_statistics(): void
    {
        $this->seed();

        $this->assertGreaterThan(0, GuestBook::whereDate('created_at', today())->count());
        $this->assertGreaterThan(
            0,
            GuestBook::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count()
        );
        $this->assertSame(24, GuestBook::count());
    }

    public function test_seeders_are_idempotent(): void
    {
        $this->seed();

        $this->seed(GuestBookQuestionSeeder::class);
        $this->seed(GuestBookSeeder::class);

        $this->assertSame(6, GuestBookQuestion::count());
        $this->assertSame(27, GuestBookQuestionOption::count());
        $this->assertSame(24, GuestBook::count());
        $this->assertSame(24 * 6, GuestBookAnswer::count());
    }
}
