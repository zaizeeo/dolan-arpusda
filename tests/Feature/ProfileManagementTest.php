<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProfileManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_profile_pages(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('profile.show'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('dashboard/profile/index'));

        $this->actingAs($user)
            ->get(route('profile.edit'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('dashboard/profile/edit'));

        $this->actingAs($user)
            ->get(route('settings'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('dashboard/settings/index'));
    }

    public function test_guest_is_redirected_from_profile_pages(): void
    {
        $this->get(route('profile.show'))->assertRedirect(route('login'));
        $this->get(route('profile.edit'))->assertRedirect(route('login'));
        $this->get(route('settings'))->assertRedirect(route('login'));
    }

    public function test_user_can_update_name_and_email(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('profile.edit'))
            ->post(route('profile.update'), [
                'name' => 'Nama Baru',
                'email' => 'nama.baru@example.com',
            ])
            ->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nama Baru',
            'email' => 'nama.baru@example.com',
        ]);
    }

    public function test_user_can_upload_a_new_avatar(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $oldAvatar = $user->avatar;

        $this->actingAs($user)
            ->from(route('profile.edit'))
            ->post(route('profile.update'), [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => UploadedFile::fake()->image('avatar.jpg'),
            ])
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertNotSame($oldAvatar, $user->avatar);
        $this->assertStringContainsString('/storage/avatars/', $user->avatar);

        $path = ltrim(str_replace(Storage::disk('public')->url(''), '', $user->avatar), '/');
        Storage::disk('public')->assertExists($path);
    }

    public function test_replacing_avatar_deletes_the_previous_stored_file(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        Storage::disk('public')->put('avatars/avatar-lama.jpg', 'avatar lama');
        $user->update(['avatar' => Storage::disk('public')->url('avatars/avatar-lama.jpg')]);

        $this->actingAs($user)
            ->from(route('profile.edit'))
            ->post(route('profile.update'), [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => UploadedFile::fake()->image('avatar-baru.jpg'),
            ])
            ->assertRedirect(route('profile.edit'));

        Storage::disk('public')->assertMissing('avatars/avatar-lama.jpg');
    }

    public function test_user_cannot_use_email_owned_by_another_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $this->actingAs($user)
            ->from(route('profile.edit'))
            ->post(route('profile.update'), [
                'name' => $user->name,
                'email' => $otherUser->email,
            ])
            ->assertSessionHasErrors('email');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => $user->email,
        ]);
    }

    public function test_user_can_update_password_with_current_password(): void
    {
        $user = User::factory()->create(['password' => 'password-lama']);

        $this->actingAs($user)
            ->from(route('settings'))
            ->patch(route('profile.password.update'), [
                'current_password' => 'password-lama',
                'password' => 'password-baru',
                'password_confirmation' => 'password-baru',
            ])
            ->assertRedirect(route('settings'));

        $this->assertTrue(Hash::check('password-baru', $user->refresh()->password));
    }

    public function test_user_cannot_update_password_with_wrong_current_password(): void
    {
        $user = User::factory()->create(['password' => 'password-lama']);

        $this->actingAs($user)
            ->from(route('settings'))
            ->patch(route('profile.password.update'), [
                'current_password' => 'password-salah',
                'password' => 'password-baru',
                'password_confirmation' => 'password-baru',
            ])
            ->assertSessionHasErrors('current_password');

        $this->assertTrue(Hash::check('password-lama', $user->refresh()->password));
    }
}
