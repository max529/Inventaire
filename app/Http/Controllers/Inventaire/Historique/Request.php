<?php

namespace App\Http\Controllers\Inventaire\Historique;

use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public int $id_materiel_variation;
    public int $id_equipe;
    public int $page;
}
