<?php

namespace Tests\Feature\Models;

use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestBookAnswerTest extends TestCase
{
    use RefreshDatabase;

    public function test_answer_returns_the_selected_question_option(): void
    {
        $question = GuestBookQuestion::factory()->create();
        $option = GuestBookQuestionOption::factory()->for($question, 'question')->create();
        $answer = GuestBookAnswer::factory()
            ->for($question, 'question')
            ->for($option, 'option')
            ->create();

        $this->assertTrue($answer->option->is($option));
    }

    public function test_answer_returns_null_option_when_the_question_has_no_options(): void
    {
        $answer = GuestBookAnswer::factory()->create();

        $this->assertNull($answer->option);
    }

    public function test_a_guest_book_cannot_answer_the_same_question_twice(): void
    {
        $answer = GuestBookAnswer::factory()->create();

        $this->expectException(QueryException::class);

        GuestBookAnswer::factory()
            ->for($answer->guestBook, 'guestBook')
            ->for($answer->question, 'question')
            ->create();
    }
}
