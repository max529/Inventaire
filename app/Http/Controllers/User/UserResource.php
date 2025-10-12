<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<User>
 */
class UserResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    public string $prenom;
    public string $nom_utilisateur;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->prenom = $item->prenom;
        $this->nom_utilisateur = $item->nom_utilisateur;
    }
}
