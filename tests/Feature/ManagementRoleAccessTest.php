<?php

namespace Tests\Feature;

use App\Models\GuestBook;
use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManagementRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<int, string>
     */
    private function managementPages(): array
    {
        return [
            route('dashboard.management.guest-book.index'),
            route('dashboard.management.guest-book-question.index'),
            route('survey-response-index'),
            route('survey-question-index'),
        ];
    }

    public function test_intern_can_view_statistics_pages(): void
    {
        $intern = User::factory()->create(['role' => 'intern']);

        $this->actingAs($intern)
            ->get(route('guest-book-statistics-index'))
            ->assertOk();

        $this->actingAs($intern)
            ->get(route('survey-statistics-index'))
            ->assertOk();
    }

    public function test_staff_can_view_statistics_pages(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($staff)
            ->get(route('guest-book-statistics-index'))
            ->assertOk();

        $this->actingAs($staff)
            ->get(route('survey-statistics-index'))
            ->assertOk();
    }

    public function test_intern_cannot_access_management_or_user_management_pages(): void
    {
        $intern = User::factory()->create(['role' => 'intern']);

        foreach ([...$this->managementPages(), route('user-controller-index')] as $url) {
            $this->actingAs($intern)
                ->get($url)
                ->assertRedirect(route('guest-book-statistics-index'));
        }
    }

    public function test_staff_can_read_all_operational_management_pages(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);

        foreach ($this->managementPages() as $url) {
            $this->actingAs($staff)
                ->get($url)
                ->assertOk();
        }
    }

    public function test_staff_cannot_access_user_management_page(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($staff)
            ->get(route('user-controller-index'))
            ->assertRedirect(route('guest-book-statistics-index'));
    }

    public function test_staff_cannot_mutate_management_data(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $guestBook = GuestBook::factory()->create();
        $surveyResponse = SurveyResponse::factory()->create();

        $this->actingAs($staff)
            ->delete(route('delete-guest-book', $guestBook))
            ->assertRedirect(route('guest-book-statistics-index'));

        $this->assertNotSoftDeleted('guest_books', ['id' => $guestBook->id]);

        $this->actingAs($staff)
            ->delete(route('delete-survey-response', $surveyResponse))
            ->assertRedirect(route('guest-book-statistics-index'));

        $this->assertNotSoftDeleted('survey_responses', ['id' => $surveyResponse->id]);

        $this->actingAs($staff)
            ->post(route('create-guest-book-question'), [])
            ->assertRedirect(route('guest-book-statistics-index'));

        $this->actingAs($staff)
            ->post(route('create-survey-question'), [])
            ->assertRedirect(route('guest-book-statistics-index'));
    }

    public function test_admin_can_read_operational_management_and_user_management_pages(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        foreach ([...$this->managementPages(), route('user-controller-index')] as $url) {
            $this->actingAs($admin)
                ->get($url)
                ->assertOk();
        }
    }

    public function test_superadmin_can_read_operational_management_and_user_management_pages(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        foreach ([...$this->managementPages(), route('user-controller-index')] as $url) {
            $this->actingAs($superadmin)
                ->get($url)
                ->assertOk();
        }
    }
}
