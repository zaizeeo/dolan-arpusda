<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class PromoteUserToSuperadminAction
{
    /**
     * Promote an admin user to superadmin and demote the current superadmin.
     *
     * @param  string  $targetUserId
     * @param  \App\Models\User  $currentUser
     * @return void
     */
    public function execute(string $targetUserId, User $currentUser): void
    {
        // 1. Current user must be superadmin
        if (! $currentUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Hanya Superadmin yang dapat mempromosikan pengguna menjadi Superadmin!',
            ]);
        }

        // 2. Ensure there is exactly one superadmin in the system (the current user)
        $superadminCount = User::where('role', 'superadmin')->count();
        if ($superadminCount !== 1) {
            throw ValidationException::withMessages([
                'server' => 'Tidak dapat mempromosikan karena kondisi superadmin tidak valid. Harus ada tepat satu Superadmin.',
            ]);
        }

        // 3. Find target user
        $targetUser = User::find($targetUserId);
        if (! $targetUser) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna target tidak ditemukan!',
            ]);
        }

        // 4. Target user must be an admin (not already superadmin)
        if ($targetUser->hasSuperAdminAuthority()) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna target sudah merupakan Superadmin!',
            ]);
        }

        // Optional: ensure target user is admin (maybe we want to allow promoting any user? but rule says promote any admin)
        if ($targetUser->role !== 'admin') {
            throw ValidationException::withMessages([
                'server' => 'Hanya pengguna dengan role Admin yang dapat dipromosikan menjadi Superadmin!',
            ]);
        }

        // 5. Perform the swap within a transaction
        DB::transaction(function () use ($targetUser, $currentUser) {
            // Promote target user to superadmin
            $targetUser->update(['role' => 'superadmin']);

            // Demote current superadmin to admin
            $currentUser->update(['role' => 'admin']);
        });
    }

    /**
     * Invokable alias for execute.
     *
     * @param  string  $targetUserId
     * @param  \App\Models\User  $currentUser
     * @return void
     */
    public function __invoke(string $targetUserId, User $currentUser): void
    {
        $this->execute($targetUserId, $currentUser);
    }
}