<?php

namespace Tests\Feature;

use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SequenceOrderingTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_move_a_guest_book_question_down_and_back_up(): void
    {
        $admin = $this->admin();
        $first = GuestBookQuestion::factory()->create(['label' => 'Pertama', 'sequence_number' => 1]);
        $second = GuestBookQuestion::factory()->create(['label' => 'Kedua', 'sequence_number' => 2]);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'down'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(2, $first->refresh()->sequence_number);
        $this->assertSame(1, $second->refresh()->sequence_number);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'up'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $second->refresh()->sequence_number);
    }

    public function test_admin_can_move_a_guest_book_question_option_within_its_question(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $otherQuestion = GuestBookQuestion::factory()->create(['sequence_number' => 2]);
        $first = GuestBookQuestionOption::factory()->for($question, 'question')->create(['sequence_number' => 1]);
        $second = GuestBookQuestionOption::factory()->for($question, 'question')->create(['sequence_number' => 2]);
        $foreign = GuestBookQuestionOption::factory()->for($otherQuestion, 'question')->create(['sequence_number' => 1]);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-option-sequence', $first), ['direction' => 'down'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(2, $first->refresh()->sequence_number);
        $this->assertSame(1, $second->refresh()->sequence_number);
        $this->assertSame(1, $foreign->refresh()->sequence_number);
    }

    public function test_admin_can_move_a_survey_question_within_its_survey(): void
    {
        $admin = $this->admin();
        $survey = Survey::factory()->create(['is_active' => true]);
        $otherSurvey = Survey::factory()->inactive()->create();
        $first = SurveyQuestion::factory()->create(['survey_id' => $survey->id, 'sequence_number' => 1]);
        $second = SurveyQuestion::factory()->create(['survey_id' => $survey->id, 'sequence_number' => 2]);
        $foreign = SurveyQuestion::factory()->create(['survey_id' => $otherSurvey->id, 'sequence_number' => 1]);

        $this->actingAs($admin)
            ->from(route('survey-question-index'))
            ->patch(route('move-survey-question-sequence', $second), ['direction' => 'up'])
            ->assertRedirect(route('survey-question-index'));

        $this->assertSame(2, $first->refresh()->sequence_number);
        $this->assertSame(1, $second->refresh()->sequence_number);
        $this->assertSame(1, $foreign->refresh()->sequence_number);
    }

    public function test_admin_can_move_a_survey_question_option_within_its_question(): void
    {
        $admin = $this->admin();
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create(['survey_id' => $survey->id, 'sequence_number' => 1]);
        $otherQuestion = SurveyQuestion::factory()->create(['survey_id' => $survey->id, 'sequence_number' => 2]);
        $first = SurveyQuestionOption::factory()->create(['survey_question_id' => $question->id, 'sequence_number' => 1]);
        $second = SurveyQuestionOption::factory()->create(['survey_question_id' => $question->id, 'sequence_number' => 2]);
        $foreign = SurveyQuestionOption::factory()->create(['survey_question_id' => $otherQuestion->id, 'sequence_number' => 1]);

        $this->actingAs($admin)
            ->from(route('survey-question-index'))
            ->patch(route('move-survey-question-option-sequence', $first), ['direction' => 'down'])
            ->assertRedirect(route('survey-question-index'));

        $this->assertSame(2, $first->refresh()->sequence_number);
        $this->assertSame(1, $second->refresh()->sequence_number);
        $this->assertSame(1, $foreign->refresh()->sequence_number);
    }

    public function test_moving_the_first_item_up_or_the_last_item_down_keeps_the_order(): void
    {
        $admin = $this->admin();
        $first = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $last = GuestBookQuestion::factory()->create(['sequence_number' => 2]);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'up'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $last->refresh()->sequence_number);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $last), ['direction' => 'down'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $last->refresh()->sequence_number);
    }

    public function test_moving_a_question_renumbers_siblings_with_sequence_gaps(): void
    {
        $admin = $this->admin();
        $first = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $second = GuestBookQuestion::factory()->create(['sequence_number' => 5]);
        $third = GuestBookQuestion::factory()->create(['sequence_number' => 10]);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $second), ['direction' => 'down'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'));

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(3, $second->refresh()->sequence_number);
        $this->assertSame(2, $third->refresh()->sequence_number);
    }

    public function test_non_admin_users_cannot_move_sequences(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $intern = User::factory()->create(['role' => 'intern']);
        $first = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $second = GuestBookQuestion::factory()->create(['sequence_number' => 2]);

        foreach ([$staff, $intern] as $user) {
            $this->actingAs($user)
                ->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'down'])
                ->assertRedirect(route('guest-book-statistics-index'));
        }

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $second->refresh()->sequence_number);
    }

    public function test_guests_are_redirected_to_login_when_moving_sequences(): void
    {
        $first = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $second = GuestBookQuestion::factory()->create(['sequence_number' => 2]);

        $this->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'down'])
            ->assertRedirect(route('login'));

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $second->refresh()->sequence_number);
    }

    public function test_invalid_sequence_direction_is_rejected(): void
    {
        $admin = $this->admin();
        $first = GuestBookQuestion::factory()->create(['sequence_number' => 1]);
        $second = GuestBookQuestion::factory()->create(['sequence_number' => 2]);

        $this->actingAs($admin)
            ->from(route('dashboard.management.guest-book-question.index'))
            ->patch(route('move-guest-book-question-sequence', $first), ['direction' => 'left'])
            ->assertRedirect(route('dashboard.management.guest-book-question.index'))
            ->assertSessionHasErrors(['direction', 'server']);

        $this->assertSame(1, $first->refresh()->sequence_number);
        $this->assertSame(2, $second->refresh()->sequence_number);
    }
}
