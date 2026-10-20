<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class UserManagementDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_page_receives_the_current_user_through_the_shared_auth_prop(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('user-controller-index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('dashboard/management/users/index')
                ->where('auth.user.id', $admin->id)
                ->missing('auth.id')
                ->missing('auth.role')
            );
    }
}
