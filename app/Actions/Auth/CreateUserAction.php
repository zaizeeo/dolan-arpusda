<?php

namespace App\Actions\Auth;

use App\Models\User;

class CreateUserAction
{
    /**
     * Create a new user instance in the database.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'staff',
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
