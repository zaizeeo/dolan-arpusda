<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestBookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- AREA PUBLIK (Tidak perlu login) ---
// Route::get('/', [BukuTamuController::class, 'create']);
// Route::post('/simpan', [BukuTamuController::class, 'store'])->name('buku-tamu.store');

// // --- AREA LOGIN ---
// Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// // --- AREA ADMIN (Dikunci dengan middleware 'auth') ---
// Route::get('/pengunjung', [BukuTamuController::class, 'index'])->name('buku-tamu.index')->middleware('auth');

// Route::get('/pengunjung/{id}/edit', [BukuTamuController::class, 'edit'])->name('buku-tamu.edit')->middleware('auth');
// Route::put('/pengunjung/{id}', [BukuTamuController::class, 'update'])->name('buku-tamu.update')->middleware('auth');

// Route::delete('/pengunjung/{id}', [BukuTamuController::class, 'destroy'])->name('buku-tamu.destroy')->middleware('auth');

Route::get('/', function () {
    return Inertia::render('home-page');
})->name('home-page');

Route::get('/auth', [AuthController::class, 'showAuthPage'])->middleware('guest.middleware')->name('login');

Route::prefix('/_api')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->name('login')->middleware(['guest.middleware']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth.middleware'])->name('logout');
    });
});


Route::prefix('/dashboard')->middleware(['auth.middleware'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/index');
    })->name('dashboard.index');
    Route::get('/management/guest-book', [GuestBookController::class,'index'])->name('dashboard.management.guest-book.index')->middleware(['admins.middleware']);
});
