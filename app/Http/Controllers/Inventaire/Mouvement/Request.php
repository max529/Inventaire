<?php

namespace App\Http\Controllers\Inventaire\Mouvement;

use Aventus\Laraventus\Requests\AventusRequest;

/**
 * 
 */
class Request extends AventusRequest
{
    public float $quantite;
    public int $id_materiel_variation;
    public int $id_equipe_entree;
    public int $id_equipe_sortie;
    public ?string $commentaire = "";
}
