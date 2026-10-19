<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class CreateUserAction
{
    /**
     * Create a new user instance in the database.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): User
    {

        $emailCount = User::where("email", $data["email"])->count();

        if ($emailCount > 0) {
            throw ValidationException::withMessages(["server" => "Email sudah digunakan oleh pengguna lain"]);
        }

        $superadminCount = User::where("role", "superadmin")->count();

        $isSuperAdminAlreadyExist = $superadminCount > 0;

        if ($isSuperAdminAlreadyExist && $data['role'] === "superadmin") {
            throw ValidationException::withMessages([
                'server' => 'Superadmin hanya bisa 1 orang!',
            ]);
        }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data): User
    {
        return $this->execute($data);
    }
}
