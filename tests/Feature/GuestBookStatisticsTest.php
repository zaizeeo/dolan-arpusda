<?php

namespace Tests\Feature;

use App\Models\GuestBook;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class GuestBookStatisticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_guest_book_statistics(): void
    {
        $user = User::factory()->create();
        GuestBook::factory()->create();

        $this->actingAs($user)
            ->get(route('guest-book-statistics-index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('dashboard/index')
                ->where('stats.total_visits', 1)
                ->has('trend', 7)
                ->has('popularOptions')
                ->has('recentVisits')
            );
    }

    public function test_guest_is_redirected_from_guest_book_statistics(): void
    {
        $this->get(route('guest-book-statistics-index'))
            ->assertRedirect(route('login'));
    }
}
