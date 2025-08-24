<?php

namespace App\Http\Requests;

use Aventus\Laraventus\Requests\AventusRequest;

class LoginRequest extends AventusRequest {
    public string $nom_utilisateur;
    public string $mot_passe;
}