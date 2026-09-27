<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BukuTamuController;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

// --- AREA PUBLIK (Tidak perlu login) ---
Route::get('/', [BukuTamuController::class, 'create']);
Route::post('/simpan', [BukuTamuController::class, 'store'])->name('buku-tamu.store');

// --- AREA LOGIN ---
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// --- AREA ADMIN (Dikunci dengan middleware 'auth') ---
Route::get('/pengunjung', [BukuTamuController::class, 'index'])->name('buku-tamu.index')->middleware('auth');

Route::get('/pengunjung/{id}/edit', [BukuTamuController::class, 'edit'])->name('buku-tamu.edit')->middleware('auth');
Route::put('/pengunjung/{id}', [BukuTamuController::class, 'update'])->name('buku-tamu.update')->middleware('auth');

Route::delete('/pengunjung/{id}', [BukuTamuController::class, 'destroy'])->name('buku-tamu.destroy')->middleware('auth');

Route::get('/home', function () {
    return Inertia::render('home-page');
});