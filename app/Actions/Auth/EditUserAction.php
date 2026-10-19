<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class EditUserAction
{
    /**
     * Update an existing user in the database.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, string $userId, User $currentUser): User
    {
        $existingUser = User::find($userId);

        if (! $existingUser) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna tidak ditemukan!',
            ]);
        }

        // 1. Tidak boleh mengedit akun sendiri dari panel manajemen user
        if ($userId === $currentUser->id) {
            throw ValidationException::withMessages([
                'server' => 'Anda dapat mengubah data akun Anda di halaman profil!',
            ]);
        }

        // 2. Admin biasa TIDAK BOLEH menyentuh/mengubah data Superadmin
        if ($existingUser->hasSuperAdminAuthority() && ! $currentUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Anda tidak memiliki izin untuk mengubah data akun Superadmin!',
            ]);
        }

        // 3. Admin biasa TIDAK BOLEH mempromosikan user menjadi Superadmin
        if (isset($data['role']) && $data['role'] === 'superadmin' && ! $currentUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Hanya Superadmin yang berhak menetapkan hak akses Superadmin!',
            ]);
        }

        // 4. Superadmin hanya boleh ada 1 di sistem
        if (isset($data['role']) && $data['role'] === 'superadmin') {
            $anotherSuperadminExists = User::where('role', 'superadmin')
                ->where('id', '!=', $userId)
                ->exists();

            if ($anotherSuperadminExists) {
                throw ValidationException::withMessages([
                    'server' => 'Hanya boleh ada 1 Superadmin di sistem!',
                ]);
            }
        }

        // 5. Mencegah akun Superadmin di-demote agar sistem tidak kehilangan Superadmin (0 superadmin)
        if ($existingUser->hasSuperAdminAuthority() && isset($data['role']) && $data['role'] !== 'superadmin') {
            throw ValidationException::withMessages([
                'server' => 'Role Superadmin tidak dapat diubah karena sistem wajib memiliki 1 Superadmin!',
            ]);
        }

        // 6. Validasi keunikan email jika email diganti
        if (isset($data['email']) && $data['email'] !== $existingUser->email) {
            $emailTaken = User::where('email', $data['email'])
                ->where('id', '!=', $userId)
                ->exists();

            if ($emailTaken) {
                throw ValidationException::withMessages([
                    'email' => 'Email ini sudah digunakan oleh pengguna lain!',
                ]);
            }
        }

        // 7. Kumpulkan payload dan update dalam 1 kali query
        $payload = [
            'name' => $data['name'] ?? $existingUser->name,
            'email' => $data['email'] ?? $existingUser->email,
            'role' => $data['role'] ?? $existingUser->role,
        ];

        if (! empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $existingUser->update($payload);

        return $existingUser;
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data, string $userId, User $currentUser): User
    {
        return $this->execute($data, $userId, $currentUser);
    }
}
