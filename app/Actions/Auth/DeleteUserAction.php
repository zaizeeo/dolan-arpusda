<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class DeleteUserAction
{

    public function execute(string $userId, User $currentUser): void
    {
        $user = User::find($userId);

        if ($user === null) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna tidak ditemukan!',
            ]);
        }

        if ($currentUser->id === $userId) {
            throw ValidationException::withMessages([
                'server' => 'Anda tidak bisa menghapus akun anda sendiri!',
            ]);
        }


        if ($user->role === "admin" && $currentUser->role !== "superadmin") {
            throw ValidationException::withMessages([
                'server' => 'Hanya Superadmin yang bisa menghapus seorang admin!',
            ]);
        }

        $user->delete();
    }


    public function __invoke(string $userId, User $currentUser): void
    {
        return $this->execute($userId, $currentUser);
    }
}
