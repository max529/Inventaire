<?php

namespace App\Http\Middlewares;

use App\Enum\Role;
use App\Models\User;
use Attribute;
use Aventus\Laraventus\Attributes\Middleware;
use Aventus\Laraventus\Tools\Console;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS)]
class IsAdmin extends Middleware
{

    public function __construct()
    {
        parent::__construct(IsAdmin::class);
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = User::$current;
        if ($user->id_role->value == Role::Admin->value) {
            return $next($request);
        }
        throw new Exception("Pas autorisé", 403);
    }
}
