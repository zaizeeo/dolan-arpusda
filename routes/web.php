<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestBookController;
use App\Http\Controllers\GuestBookQuestionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyQuestionController;
use App\Http\Controllers\SurveyResponseController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [GuestBookController::class, 'showGuestBookForm'])->name('home-page');

Route::get('/survey', [SurveyController::class, 'show'])->name('survey.show');

Route::get('/auth', [AuthController::class, 'showAuthPage'])->middleware('guest.middleware')->name('login');

Route::prefix('/_api')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->name('login.submit')->middleware(['guest.middleware']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth.middleware'])->name('logout');
    });
    Route::prefix('/dashboard')->group(function () {
        Route::prefix('/profile')->middleware(['auth.middleware'])->group(function () {
            Route::post('/', [ProfileController::class, 'update'])->name('profile.update');
            Route::patch('/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
        });

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
            Route::prefix('/survey')->middleware(['admins.middleware'])->group(function () {
                Route::delete('/responses/{surveyResponse}', [SurveyResponseController::class, 'destroy'])->name('delete-survey-response');
                Route::prefix('/question')->group(function () {
                    Route::post('/', [SurveyQuestionController::class, 'create'])->name('create-survey-question');
                    Route::patch('/{surveyQuestion}', [SurveyQuestionController::class, 'update'])->name('update-survey-question');
                    Route::delete('/{surveyQuestion}', [SurveyQuestionController::class, 'destroy'])->name('delete-survey-question');
                    Route::patch('/{surveyQuestion}/toggle-active', [SurveyQuestionController::class, 'toggleActive'])->name('toggle-survey-question-active');
                    Route::post('/{surveyQuestion}/options', [SurveyQuestionController::class, 'createOption'])->name('create-survey-question-option');
                });
                Route::prefix('/question-option')->group(function () {
                    Route::patch('/{surveyQuestionOption}', [SurveyQuestionController::class, 'updateOption'])->name('update-survey-question-option');
                    Route::delete('/{surveyQuestionOption}', [SurveyQuestionController::class, 'destroyOption'])->name('delete-survey-question-option');
                    Route::patch('/{surveyQuestionOption}/toggle-active', [SurveyQuestionController::class, 'toggleOptionActive'])->name('toggle-survey-question-option-active');
                });
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

    Route::post('/survey', [SurveyController::class, 'submit'])->name('survey.submit');
});

Route::prefix('/dashboard')->middleware(['auth.middleware'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/settings', [ProfileController::class, 'settings'])->name('settings');
    Route::get('/statistics/survey', [SurveyResponseController::class, 'statistics'])->name('survey-statistics-index');
    Route::prefix('/management')->group(function () {
        Route::get('/guest-book', [GuestBookController::class, 'index'])->name('dashboard.management.guest-book.index')->middleware(['admins.middleware']);
        Route::prefix('/guest-book-question')->group(function () {
            Route::get('/', [GuestBookQuestionController::class, 'index'])->name('dashboard.management.guest-book-question.index')->middleware(['admins.middleware']);
        });

        Route::get('/survey', [SurveyResponseController::class, 'index'])->name('survey-response-index')->middleware(['admins.middleware']);
        Route::get('/survey/question', [SurveyQuestionController::class, 'index'])->name('survey-question-index')->middleware(['admins.middleware']);

        Route::get('/users', [UserController::class, 'index'])->name('user-controller-index')->middleware(['admins.middleware']);
    });
});
