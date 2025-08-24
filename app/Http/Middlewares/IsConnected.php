<?php

namespace App\Http\Middlewares;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsConnected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (session("user") == null) {
        //     return redirect('/login');
        // }
        // $id = intval(session("user"));
        // $user = User::find($id);
        // if ($user == null) {
        //     session("user", null);
        //     return redirect('/login');
        // }
        // User::$current = $user;
        return $next($request);
    }
}
