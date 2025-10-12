<?php

namespace App\Http\Controllers\Auth\Login;

use Aventus\Laraventus\Attributes\Rename;
use App\Models\User;
use Aventus\Laraventus\Exceptions\LaraventusErrorEnum;
use Illuminate\Support\Facades\Hash;
use Aventus\Laraventus\Helpers\AventusError;

#[Rename("AuthLoginController")]
class Controller
{
    public function request(Request $request): AventusError|Response
    {
        /** @var User $user */
        $user = User::where("nom_utilisateur", $request->nom_utilisateur)->first();
        if ($user) {
            if ($user->mot_passe == Hash::make($request->mot_passe)) {
                session("user", $user->id);
                return new Response();
            }
        }
        return new AventusError(LaraventusErrorEnum::ValidationError, "Informations non valides");
    }
}
