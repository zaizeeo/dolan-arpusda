<?php

namespace App\Http\Controllers;

use App\Actions\Auth\CreateUserAction;
use App\Actions\Auth\DeleteUserAction;
use App\Actions\Auth\EditUserAction;
use App\Http\Requests\Auth\CreateUserRequest;
use App\Http\Requests\Auth\EditUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index()
    {
        $users = User::get();
        return Inertia::render('dashboard/management/users/index', compact('users'));
    }

    public function createUser(CreateUserRequest $request, CreateUserAction $createUserAction)
    {
        $createUserAction->execute($request->validated());

        return redirect()->back()->with('success', 'User berhasil dibuat');
    }

    public function deleteUser(Request $request, string $id, DeleteUserAction $deleteUserAction)
    {
        $deleteUserAction->execute($id, $request->user());

        return redirect()->back();
    }

    public function editUser(EditUserRequest $request, string $id, EditUserAction $editUserAction)
    {
        $editUserAction->execute($request->validated(), $id, $request->user());

        return redirect()->back();
    }
}
