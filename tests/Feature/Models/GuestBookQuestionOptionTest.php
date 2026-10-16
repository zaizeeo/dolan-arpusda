<?php

namespace Tests\Feature\Models;

use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestionOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestBookQuestionOptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_question_option_returns_the_answers_that_selected_it(): void
    {
        $option = GuestBookQuestionOption::factory()->create();
        $answer = GuestBookAnswer::factory()->for($option, 'option')->create();

        $this->assertSame([$answer->id], $option->answers->pluck('id')->all());
    }

    public function test_question_option_returns_empty_answers_before_anyone_selects_it(): void
    {
        $option = GuestBookQuestionOption::factory()->create();

        $this->assertSame([], $option->answers->pluck('id')->all());
    }
}
