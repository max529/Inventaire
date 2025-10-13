<?php

namespace App\Http\Controllers\Inventaire\Update;

use App\Models\Inventaire;
use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public ?int $id;
    public float $quantite;
    public int $id_materiel;
    public int $id_equipe;
    public ?int $id_variation;
}
