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
        if ($request->user()==null){
            return redirect()->route("login");
        }
        if (!$request->user()->hasAdminsAuthority()){
            return redirect()->route("dashboard.index");
        }
        return $next($request);
    }
}
