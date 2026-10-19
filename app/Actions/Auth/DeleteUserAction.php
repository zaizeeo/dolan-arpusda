<?php

use App\Models\User;
use Illuminate\Validation\ValidationException;

class DeleteUserAction
{

    //  * @param  array<string, mixed>  $data
    public function execute(array $data, User $currentUser): void
    {
        $user = User::find($data["id"]);

        if ($user === null) {
            throw ValidationException::withMessages([
                'server' => 'Pengguna tidak ditemukan!',
            ]);
        }

        if ($currentUser->id === $data['id']) {
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


    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data, User $currentUser): void
    {
        return $this->execute($data, $currentUser);
    }
}
