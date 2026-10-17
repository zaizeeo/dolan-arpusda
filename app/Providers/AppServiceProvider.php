<?php

namespace App\Providers;

use App\Exceptions\ErrorHandler;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            Inertia::handleExceptionsUsing(new ErrorHandler);
        }
    }
}
