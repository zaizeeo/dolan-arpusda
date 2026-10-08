<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Menampilkan halaman form login
    public function showAuthPage()
    {
        return Inertia::render('auth-page');
    }

    public function createUser(Request $request)
    {
        try {
            $data = $request->validate(
                [
                    'name' => ['required', 'min:2', 'max:128'],
                    'email' => ['required', 'email'],
                    'password' => ['required', 'min:8', 'max:32'],
                    'role' => ['required', 'in:magang,staff,admin,superadmin']
                ],
                [
                    'name.min' => 'Nama harus diisi minimal 2 karakter',
                    'name.max' => 'Nama maksimal 128 karakter',
                    'email.required' => 'Email harus diisi',
                    'email.email' => 'Mohon isi email yang valid',
                    'password.required' => 'password harus diisi',
                    'password.min' => 'Password minimal 8 karakter',
                    'password.max' => 'Password maksimal 32 karakter',
                    'role.required' => 'Pilih role yang tersedia',
                    'role.in' => 'Role harus diantara magang, staff, admin, dan superadmin'
                ]
            );
        } catch (\Throwable $th) {
            if ($th instanceof ValidationException) {
                return redirect()->back()->withErrors($th->getMessage(), 'server');
            }
            return redirect()->back()->withErrors('Terjadi kesalahan Coba lagi beberapa saat', 'server');
        }
    }

    // Memproses data login yang diinput
    public function login(Request $request)
    {
        try {
            $data = $request->validate(
                [
                    'email' => ['required', 'email'],
                    'password' => ['required', 'min:8', 'max:32'],
                ],
                [
                    'email.required' => 'Email harus diisi',
                    'email.email' => 'Mohon isi email yang valid',
                    'password.required' => 'Password harus diisi',
                    'password.min' => 'Password minimal 8 karakter',
                    'password.max' => 'Password maksimal 32 karakte r',
                ]
            );
            // Mengecek apakah email dan password cocok di database
            if (Auth::attempt($data)) {
                $request->session()->regenerate();
                return redirect()->route('dashboard.index'); // Arahkan ke tabel jika berhasil
            }


            // Jika salah, kembalikan ke halaman login dengan pesan error
            return back()->withErrors('Email atau password tidak valid!', 'server');
        } catch (\Throwable $th) {
            if ($th instanceof ValidationException) {
                return redirect()->back()->withErrors($th->getMessage(), 'server');
            }
            return redirect()->back()->withErrors('Terjadi kesalahan Coba lagi beberapa saat', 'server');
        }
    }

    // Memproses proses keluar (logout)
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/'); // Arahkan kembali ke form buku tamu tamu
    }
}
