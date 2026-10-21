<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_cannot_edit_a_superadmin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $superadmin = User::factory()->create(['role' => 'superadmin', 'name' => 'Super Admin']);

        $this->actingAs($admin)
            ->from(route('user-controller-index'))
            ->patch(route('user-controller-edit', $superadmin->id), ['name' => 'Diubah Admin'])
            ->assertRedirect(route('user-controller-index'))
            ->assertSessionHasErrors('server');

        $this->assertSame('Super Admin', $superadmin->fresh()->name);
    }

    public function test_admin_cannot_delete_a_superadmin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($admin)
            ->from(route('user-controller-index'))
            ->delete(route('user-controller-delete', $superadmin->id))
            ->assertRedirect(route('user-controller-index'))
            ->assertSessionHasErrors('server');

        $this->assertDatabaseHas('users', ['id' => $superadmin->id]);
    }

    public function test_superadmin_can_edit_another_user(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($superadmin)
            ->from(route('user-controller-index'))
            ->patch(route('user-controller-edit', $admin->id), ['name' => 'Admin Diperbarui'])
            ->assertRedirect(route('user-controller-index'));

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'name' => 'Admin Diperbarui']);
    }

    public function test_superadmin_can_change_a_user_role_to_intern(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $staff = User::factory()->create(['role' => 'staff']);

        $this->actingAs($superadmin)
            ->from(route('user-controller-index'))
            ->patch(route('user-controller-edit', $staff->id), ['role' => 'intern'])
            ->assertRedirect(route('user-controller-index'));

        $this->assertDatabaseHas('users', ['id' => $staff->id, 'role' => 'intern']);
    }

    public function test_admin_cannot_promote_an_admin_to_superadmin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $targetAdmin = User::factory()->create(['role' => 'admin']);
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($admin)
            ->from(route('user-controller-index'))
            ->post(route('user-controller-promote-to-superadmin', $targetAdmin->id))
            ->assertRedirect(route('user-controller-index'))
            ->assertSessionHasErrors('server');

        $this->assertDatabaseHas('users', ['id' => $targetAdmin->id, 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['id' => $superadmin->id, 'role' => 'superadmin']);
    }

    public function test_superadmin_promotes_an_admin_and_becomes_admin(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($superadmin)
            ->from(route('user-controller-index'))
            ->post(route('user-controller-promote-to-superadmin', $admin->id))
            ->assertRedirect(route('user-controller-index'));

        $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => 'superadmin']);
        $this->assertDatabaseHas('users', ['id' => $superadmin->id, 'role' => 'admin']);
        $this->assertSame(1, User::where('role', 'superadmin')->count());
    }

    public function test_superadmin_cannot_create_another_superadmin(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);

        $this->actingAs($superadmin)
            ->from(route('user-controller-index'))
            ->post(route('user-controller-create'), [
                'name' => 'Superadmin Kedua',
                'email' => 'superadmin-kedua@example.com',
                'password' => 'password123',
                'role' => 'superadmin',
            ])
            ->assertRedirect(route('user-controller-index'))
            ->assertSessionHasErrors('server');

        $this->assertDatabaseMissing('users', ['email' => 'superadmin-kedua@example.com']);
        $this->assertSame(1, User::where('role', 'superadmin')->count());
    }
}
