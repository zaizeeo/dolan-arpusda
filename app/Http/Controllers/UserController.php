<?php

namespace App\Http\Controllers;

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
}
