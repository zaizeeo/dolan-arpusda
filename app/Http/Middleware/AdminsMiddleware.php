<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() == null) {
            return redirect()->route('login');
        }
        if (! $request->user()->hasAdminsAuthority()) {
            // if (str_starts_with($request->path, "/_api") || str_starts_with($request->path, "/api")) {
            //     return redirect()->back()->withErrors("Forbidden", "server");
            // }
            return redirect()->route('guest-book-statistics-index');
        }

        return $next($request);
    }
}
