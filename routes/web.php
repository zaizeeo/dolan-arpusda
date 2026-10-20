<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestBookController;
use App\Http\Controllers\GuestBookQuestionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [GuestBookController::class, 'showGuestBookForm'])->name('home-page');

Route::get('/auth', [AuthController::class, 'showAuthPage'])->middleware('guest.middleware')->name('login');

Route::prefix('/_api')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->name('login.submit')->middleware(['guest.middleware']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth.middleware'])->name('logout');
    });
    Route::prefix('/dashboard')->group(function () {
        Route::prefix('/management')->group(function () {
            Route::prefix('/guest-book-question')->middleware(['admins.middleware'])->group(function () {
                Route::post('/', [GuestBookQuestionController::class, 'create'])->name('create-guest-book-question');
                Route::patch('/{guestBookQuestion}', [GuestBookQuestionController::class, 'update'])->name('update-guest-book-question');
                Route::delete('/{guestBookQuestion}', [GuestBookQuestionController::class, 'destroy'])->name('delete-guest-book-question');
                Route::patch('/{guestBookQuestion}/toggle-active', [GuestBookQuestionController::class, 'toggleActive'])->name('toggle-guest-book-question-active');
                Route::post('/{guestBookQuestion}/options', [GuestBookQuestionController::class, 'createOption'])->name('create-guest-book-question-option');
            });
            Route::prefix('/guest-book-question-option')->middleware(['admins.middleware'])->group(function () {
                Route::patch('/{guestBookQuestionOption}', [GuestBookQuestionController::class, 'updateOption'])->name('update-guest-book-question-option');
                Route::delete('/{guestBookQuestionOption}', [GuestBookQuestionController::class, 'destroyOption'])->name('delete-guest-book-question-option');
                Route::patch('/{guestBookQuestionOption}/toggle-active', [GuestBookQuestionController::class, 'toggleOptionActive'])->name('toggle-guest-book-question-option-active');
            });
            Route::prefix('/users')->group(function () {
                Route::post('/', [UserController::class, 'createUser'])->name('user-controller-create')->middleware(['admins.middleware']);
                Route::patch('/{id}', [UserController::class, 'editUser'])->name('user-controller-edit')->middleware(['admins.middleware']);
                Route::delete('/{id}', [UserController::class, 'deleteUser'])->name('user-controller-delete')->middleware(['admins.middleware']);
                Route::post('/{id}/promote-to-superadmin', [UserController::class, 'promoteToSuperadmin'])->name('user-controller-promote-to-superadmin')->middleware(['admins.middleware']);
            });
        });
    });

    Route::prefix('guest-book')->group(function () {
        Route::post('/', [GuestBookController::class, 'create'])->name('create-guest-book');
        Route::delete('/{guestBook}', [GuestBookController::class, 'destroy'])->name('delete-guest-book')->middleware(['admins.middleware']);
    });
});

Route::prefix('/dashboard')->middleware(['auth.middleware'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::prefix('/management')->group(function () {
        Route::get('/guest-book', [GuestBookController::class, 'index'])->name('dashboard.management.guest-book.index')->middleware(['admins.middleware']);
        Route::prefix('/guest-book-question')->group(function () {
            Route::get('/', [GuestBookQuestionController::class, 'index'])->name('dashboard.management.guest-book-question.index')->middleware(['admins.middleware']);
        });

        Route::get('/users', [UserController::class, 'index'])->name('user-controller-index')->middleware(['admins.middleware']);
    });
});
