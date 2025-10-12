<?php

namespace App\Http\Controllers\Auth\Login;

use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public string $nom_utilisateur;
    public string $mot_passe;
}
