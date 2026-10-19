<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class DeleteUserAction
{

    public function execute(string $userId, User $currentUser): void
    {
        $existingUser = User::find($userId);

        if ($existingUser === null) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna tidak ditemukan!',
            ]);
        }

        if ($currentUser->id === $userId) {
            throw ValidationException::withMessages([
                'server' => 'Anda tidak bisa menghapus akun anda sendiri!',
            ]);
        }

        if ($existingUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Tidak bisa menghapus data Superadmin!',
            ]);
        }

        if ($existingUser->role === "admin" && !$currentUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Hanya Superadmin yang bisa menghapus seorang admin!',
            ]);
        }

        $existingUser->delete();
    }


    public function __invoke(string $userId, User $currentUser): void
    {
        $this->execute($userId, $currentUser);
    }
}
