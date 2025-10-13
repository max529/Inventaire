<?php

namespace App\Http\Controllers\Auth\Logout;

use Aventus\Laraventus\Attributes\Rename;

#[Rename("AuthLogoutController")]
class Controller
{
    public function request(): void
    {
        session(['user' => null]);
        return;
    }
}
