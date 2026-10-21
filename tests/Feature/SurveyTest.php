<?php

namespace Tests\Feature;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SurveyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_open_the_survey_without_submitting_the_guest_book(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'label' => 'Seberapa puas Anda?',
            'sequence_number' => 1,
        ]);
        SurveyQuestionOption::factory()->create([
            'survey_question_id' => $question->id,
            'label' => 'Puas',
        ]);

        $this->get(route('survey.show'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('survey/index')
                ->where('survey.id', $survey->id)
                ->where('survey.questions.0.label', 'Seberapa puas Anda?')
                ->where('survey.questions.0.options.0.label', 'Puas')
            );
    }

    public function test_guests_can_submit_a_survey_response(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);

        $choiceQuestion = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'label' => 'Seberapa puas Anda?',
            'sequence_number' => 1,
        ]);
        $option = SurveyQuestionOption::factory()->create([
            'survey_question_id' => $choiceQuestion->id,
            'label' => 'Sangat Puas',
        ]);

        $textQuestion = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'label' => 'Saran dan masukan',
            'sequence_number' => 2,
        ]);

        $response = $this->post(route('survey.submit'), [
            'survey_id' => $survey->id,
            'answers' => [
                [
                    'survey_question_id' => $choiceQuestion->id,
                    'survey_question_option_id' => $option->id,
                    'custom_text' => null,
                ],
                [
                    'survey_question_id' => $textQuestion->id,
                    'survey_question_option_id' => null,
                    'custom_text' => 'Tingkatkan fasilitas ruang tunggu.',
                ],
            ],
        ]);

        $response->assertRedirect(route('survey.show'));

        $this->assertDatabaseHas('survey_responses', [
            'survey_id' => $survey->id,
        ]);
        $this->assertDatabaseHas('survey_answers', [
            'survey_question_id' => $choiceQuestion->id,
            'survey_question_option_id' => $option->id,
        ]);
        $this->assertDatabaseHas('survey_answers', [
            'survey_question_id' => $textQuestion->id,
            'custom_text' => 'Tingkatkan fasilitas ruang tunggu.',
        ]);
    }

    public function test_survey_submission_requires_all_questions_and_valid_options(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'sequence_number' => 1,
        ]);
        SurveyQuestionOption::factory()->create([
            'survey_question_id' => $question->id,
        ]);
        $foreignQuestion = SurveyQuestion::factory()->create(['sequence_number' => 1]);
        $foreignOption = SurveyQuestionOption::factory()->create([
            'survey_question_id' => $foreignQuestion->id,
        ]);

        $this->from(route('survey.show'))
            ->post(route('survey.submit'), [
                'survey_id' => $survey->id,
                'answers' => [
                    [
                        'survey_question_id' => $question->id,
                        'survey_question_option_id' => $foreignOption->id,
                        'custom_text' => null,
                    ],
                ],
            ])
            ->assertRedirect(route('survey.show'))
            ->assertSessionHasErrors('answers.0.survey_question_option_id');

        $this->assertDatabaseCount('survey_responses', 0);
    }

    public function test_custom_text_is_required_when_the_selected_option_allows_it(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'sequence_number' => 1,
        ]);
        $option = SurveyQuestionOption::factory()->create([
            'survey_question_id' => $question->id,
            'is_allow_custom_text' => true,
        ]);

        $this->from(route('survey.show'))
            ->post(route('survey.submit'), [
                'survey_id' => $survey->id,
                'answers' => [
                    [
                        'survey_question_id' => $question->id,
                        'survey_question_option_id' => $option->id,
                        'custom_text' => null,
                    ],
                ],
            ])
            ->assertSessionHasErrors('answers.0.custom_text');
    }

    public function test_admin_can_view_survey_responses_and_delete_a_response(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create(['survey_id' => $survey->id]);
        $response = SurveyResponse::factory()->create(['survey_id' => $survey->id]);
        $answer = SurveyAnswer::factory()->create([
            'survey_response_id' => $response->id,
            'survey_question_id' => $question->id,
        ]);

        $this->actingAs($admin)
            ->get(route('survey-response-index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('dashboard/management/survey/index')
                ->where('survey.id', $survey->id)
                ->has('responses', 1)
            );

        $this->actingAs($admin)
            ->delete(route('delete-survey-response', $response))
            ->assertRedirect();

        $this->assertSoftDeleted('survey_responses', ['id' => $response->id]);
        $this->assertSoftDeleted('survey_answers', ['id' => $answer->id]);
    }

    public function test_admin_can_manage_survey_questions_and_options(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $survey = Survey::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->get(route('survey-question-index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('dashboard/management/survey/question')
                ->where('survey.id', $survey->id)
            );

        $this->actingAs($admin)
            ->from(route('survey-question-index'))
            ->post(route('create-survey-question'), [
                'label' => 'Pertanyaan baru',
                'description' => 'Deskripsi pertanyaan',
                'options' => [
                    ['label' => 'Opsi A', 'description' => null, 'is_allow_custom_text' => false],
                    ['label' => 'Opsi B', 'description' => null, 'is_allow_custom_text' => true],
                ],
            ])
            ->assertRedirect(route('survey-question-index'));

        $question = SurveyQuestion::where('survey_id', $survey->id)->where('label', 'Pertanyaan baru')->firstOrFail();
        $option = $question->options()->where('label', 'Opsi A')->firstOrFail();

        $this->assertDatabaseHas('survey_questions', [
            'survey_id' => $survey->id,
            'label' => 'Pertanyaan baru',
        ]);
        $this->assertDatabaseCount('survey_question_options', 2);

        $this->actingAs($admin)
            ->patch(route('toggle-survey-question-active', $question))
            ->assertRedirect();

        $this->assertFalse($question->fresh()->is_active);

        $this->actingAs($admin)
            ->patch(route('toggle-survey-question-option-active', $option))
            ->assertRedirect();

        $this->assertFalse($option->fresh()->is_active);

        $this->actingAs($admin)
            ->delete(route('delete-survey-question', $question))
            ->assertRedirect();

        $this->assertSoftDeleted('survey_questions', ['id' => $question->id]);
        $this->assertSoftDeleted('survey_question_options', ['id' => $option->id]);
    }

    public function test_staff_cannot_manage_survey_questions(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($staff)
            ->get(route('survey-question-index'))
            ->assertRedirect(route('dashboard.index'));
    }
}
