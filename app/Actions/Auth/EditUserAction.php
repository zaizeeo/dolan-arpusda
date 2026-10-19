<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EditUserAction
{

    /**
     * Create a new user instance in the database.
     */
    public function execute(array $data, string $userId, User $currentUser): User
    {
        $existingSuperadmin = User::where("role", "superadmin")->first();

        $existingUser = User::find($userId);

        if (!$existingUser) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna tidak ditemukan!'
            ]);
        }

        if ($userId === $currentUser->id) {
            throw ValidationException::withMessages([
                'server' => 'Anda bisa mengubah data akun anda di halaman profile'
            ]);
        }

        if (($data['role'] === "superadmin") && ($userId !== $existingSuperadmin->id)) {
            throw ValidationException::withMessages([
                'server' => 'Hanya boleh ada 1 Superadmin'
            ]);
        }

        $existingUser->update([
            'email' => $data['email'] ?? $existingUser->email,
            'name' => $data['name'] ?? $existingUser->name,
            'role' => $data['role'] ?? $existingUser->name,
        ]);

        if ($data['password']) {
            $existingUser->update(['password' => Hash::make($data['password'])]);
        }

        $existingUser->save();

        return $existingUser;
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(array $data, string $userId, User $currentUser): User
    {
        return $this->execute($data, $userId, $currentUser);
    }
}
