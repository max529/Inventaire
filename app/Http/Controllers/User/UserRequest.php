<?php

namespace App\Http\Controllers\User;

use Aventus\Laraventus\Requests\AventusRequest;

class UserRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    public string $prenom;
    public string $nom_utilisateur;
    public int $id_role;
    public ?string $mot_passe;
}
