<?php

namespace App\Http\Controllers;

use App\Actions\Auth\CreateUserAction;
use App\Http\Requests\Auth\CreateUserRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman login/otentikasi.
     */
    public function showAuthPage()
    {
        return Inertia::render('auth-page');
    }

    /**
     * Membuat akun user baru.
     */
    public function createUser(CreateUserRequest $request, CreateUserAction $createUserAction)
    {
        $createUserAction->execute($request->validated());

        return redirect()->back()->with('success', 'User berhasil dibuat');
    }

    /**
     * Memproses data login dengan validasi dan rate limiting.
     */
    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->route('dashboard.index');
    }

    /**
     * Memproses proses keluar (logout).
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
