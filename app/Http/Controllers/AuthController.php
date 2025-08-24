<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Aventus\Laraventus\Exceptions\LaraventusErrorEnum;
use Aventus\Laraventus\Helpers\AventusError;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function login(LoginRequest $request): AventusError|bool
    {
        /** @var User $user */
        $user = User::where("nom_utilisateur", $request->nom_utilisateur)->first();
        if ($user) {
            if ($user->mot_passe == Hash::make($request->mot_passe)) {
                session("user", $user->id);
                return true;
            }
        }
        return new AventusError(LaraventusErrorEnum::ValidationError, "Informations non valides");
    }
}
