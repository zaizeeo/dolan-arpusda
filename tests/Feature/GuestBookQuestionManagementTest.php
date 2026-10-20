<?php

namespace Tests\Feature;

use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestBookQuestionManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    private function fromIndex(): string
    {
        return route('dashboard.management.guest-book-question.index');
    }

    public function test_admin_can_create_a_question_with_options(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)
            ->from($this->fromIndex())
            ->post(route('create-guest-book-question'), [
                'label' => 'Pekerjaan',
                'description' => 'Pilih pekerjaan Anda',
                'options' => [
                    ['label' => 'Pegawai', 'description' => null, 'is_allow_custom_text' => false],
                    ['label' => 'Lainnya', 'description' => 'Isi manual', 'is_allow_custom_text' => true],
                ],
            ]);

        $response->assertRedirect($this->fromIndex());

        $question = GuestBookQuestion::where('label', 'Pekerjaan')->firstOrFail();

        $this->assertSame(1, $question->sequence_number);
        $this->assertTrue($question->is_active);
        $this->assertCount(2, $question->options);
        $this->assertSame([1, 2], $question->options->pluck('sequence_number')->all());
        $this->assertFalse($question->options->first()->is_allow_custom_text);
        $this->assertTrue($question->options->last()->is_allow_custom_text);
    }

    public function test_admin_can_create_a_question_without_options_or_description(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->post(route('create-guest-book-question'), [
                'label' => 'Nama Lengkap',
                'description' => null,
                'options' => null,
            ])
            ->assertRedirect($this->fromIndex());

        $question = GuestBookQuestion::where('label', 'Nama Lengkap')->firstOrFail();

        $this->assertNull($question->description);
        $this->assertSame(0, $question->options()->count());
    }

    public function test_admin_can_update_a_question(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create(['label' => 'Lama', 'description' => 'Lama']);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->patch(route('update-guest-book-question', $question), [
                'label' => 'Baru',
                'description' => 'Deskripsi baru',
                'is_active' => false,
            ])
            ->assertRedirect($this->fromIndex());

        $this->assertDatabaseHas('guest_book_questions', [
            'id' => $question->id,
            'label' => 'Baru',
            'description' => 'Deskripsi baru',
            'is_active' => false,
        ]);
    }

    public function test_admin_can_toggle_question_active_state(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->patch(route('toggle-guest-book-question-active', $question))
            ->assertRedirect($this->fromIndex());

        $this->assertFalse($question->refresh()->is_active);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->patch(route('toggle-guest-book-question-active', $question))
            ->assertRedirect($this->fromIndex());

        $this->assertTrue($question->refresh()->is_active);
    }

    public function test_admin_can_delete_a_question_with_its_options(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create();
        $option = GuestBookQuestionOption::factory()->for($question, 'question')->create();

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->delete(route('delete-guest-book-question', $question))
            ->assertRedirect($this->fromIndex());

        $this->assertSoftDeleted('guest_book_questions', ['id' => $question->id]);
        $this->assertSoftDeleted('guest_book_question_options', ['id' => $option->id]);
    }

    public function test_deleted_question_and_option_stay_visible_on_existing_answers(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create(['label' => 'Pertanyaan Lama']);
        $option = GuestBookQuestionOption::factory()->for($question, 'question')->create(['label' => 'Opsi Lama']);

        $answer = GuestBookAnswer::factory()
            ->for($question, 'question')
            ->create(['guest_book_question_option_id' => $option->id]);

        $this->actingAs($admin)
            ->delete(route('delete-guest-book-question', $question))
            ->assertRedirect();

        $answer->refresh();

        $this->assertSame('Pertanyaan Lama', $answer->question?->label);
        $this->assertSame('Opsi Lama', $answer->option?->label);
    }

    public function test_admin_can_create_an_option_for_a_question(): void
    {
        $admin = $this->admin();
        $question = GuestBookQuestion::factory()->create();
        GuestBookQuestionOption::factory()->for($question, 'question')->create(['sequence_number' => 1]);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->post(route('create-guest-book-question-option', $question), [
                'label' => 'Opsi Baru',
                'description' => null,
                'is_allow_custom_text' => true,
            ])
            ->assertRedirect($this->fromIndex());

        $option = $question->options()->where('label', 'Opsi Baru')->firstOrFail();

        $this->assertSame(2, $option->sequence_number);
        $this->assertTrue($option->is_active);
        $this->assertTrue($option->is_allow_custom_text);
        $this->assertNull($option->description);
    }

    public function test_admin_can_update_an_option(): void
    {
        $admin = $this->admin();
        $option = GuestBookQuestionOption::factory()->create(['label' => 'Lama']);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->patch(route('update-guest-book-question-option', $option), [
                'label' => 'Baru',
                'description' => 'Keterangan',
                'is_allow_custom_text' => true,
            ])
            ->assertRedirect($this->fromIndex());

        $this->assertDatabaseHas('guest_book_question_options', [
            'id' => $option->id,
            'label' => 'Baru',
            'description' => 'Keterangan',
            'is_allow_custom_text' => true,
        ]);
    }

    public function test_admin_can_toggle_option_active_state(): void
    {
        $admin = $this->admin();
        $option = GuestBookQuestionOption::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->patch(route('toggle-guest-book-question-option-active', $option))
            ->assertRedirect($this->fromIndex());

        $this->assertFalse($option->refresh()->is_active);
    }

    public function test_admin_can_delete_an_option(): void
    {
        $admin = $this->admin();
        $option = GuestBookQuestionOption::factory()->create();

        $this->actingAs($admin)
            ->from($this->fromIndex())
            ->delete(route('delete-guest-book-question-option', $option))
            ->assertRedirect($this->fromIndex());

        $this->assertSoftDeleted('guest_book_question_options', ['id' => $option->id]);
    }

    public function test_staff_cannot_manage_questions(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $question = GuestBookQuestion::factory()->create(['label' => 'Tetap']);

        $this->actingAs($staff)
            ->patch(route('update-guest-book-question', $question), ['label' => 'Berubah'])
            ->assertRedirect(route('dashboard.index'));

        $this->assertDatabaseHas('guest_book_questions', ['id' => $question->id, 'label' => 'Tetap']);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $question = GuestBookQuestion::factory()->create(['label' => 'Tetap']);

        $this->patch(route('update-guest-book-question', $question), ['label' => 'Berubah'])
            ->assertRedirect(route('login'));

        $this->assertDatabaseHas('guest_book_questions', ['id' => $question->id, 'label' => 'Tetap']);
    }
}
