<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Menampilkan halaman profil pengguna (hanya baca).
     */
    public function show()
    {
        return Inertia::render('dashboard/profile/index');
    }

    /**
     * Menampilkan halaman update profil pengguna.
     */
    public function edit()
    {
        return Inertia::render('dashboard/profile/edit');
    }

    /**
     * Menampilkan halaman ganti password.
     */
    public function settings()
    {
        return Inertia::render('dashboard/settings/index');
    }

    /**
     * Memperbarui data profil pengguna yang sedang login.
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->name = $request->validated('name');
        $user->email = $request->validated('email');

        if ($request->hasFile('avatar')) {
            $this->deleteStoredAvatar($user);

            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('public');
            $user->avatar = $disk->url(
                $request->file('avatar')->store('avatars', 'public')
            );
        }

        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Memperbarui password pengguna yang sedang login.
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $request->user()->update([
            'password' => $request->validated('password'),
        ]);

        return redirect()->back()->with('success', 'Password berhasil diperbarui');
    }

    /**
     * Menghapus file avatar lama jika tersimpan di disk publik.
     */
    private function deleteStoredAvatar(User $user): void
    {
        if (! is_string($user->avatar) || $user->avatar === '') {
            return;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $prefix = rtrim($disk->url(''), '/') . '/';

        if (! Str::startsWith($user->avatar, $prefix)) {
            return;
        }

        Storage::disk('public')->delete(Str::after($user->avatar, $prefix));
    }
}
