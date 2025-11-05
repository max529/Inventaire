<?php

namespace App\Http\Controllers\Inventaire\Achat;

use Aventus\Laraventus\Requests\AventusRequest;

/**
 * 
 */
class Request extends AventusRequest
{
    public float $quantite;
    public int $id_materiel_variation;
    public int $id_equipe;
    public string $commentaire;
}
