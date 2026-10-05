<?php

namespace App\Http\Controllers;

use App\Models\User;
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
                    'name.min' => 'nama harus diisi minimal 2 karakter',
                    'name.max' => 'nama maksimal 128 karakter',
                    'email.required' => 'email harus diisi',
                    'email.email' => 'mohon isi email yang valid',
                    'password.required' => 'password harus diisi',
                    'role.required' => 'pilih role yang tersedia',
                    'role.in' => 'role harus diantara magang, staff, admin, dan superadmin'
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
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Mengecek apakah email dan password cocok di database
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/pengunjung'); // Arahkan ke tabel jika berhasil
        }

        // Jika salah, kembalikan ke halaman login dengan pesan error
        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ]);
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
