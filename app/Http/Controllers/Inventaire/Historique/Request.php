<?php

namespace App\Http\Controllers\Inventaire\Historique;

use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public int $id_materiel;
    public int $id_equipe;
    public ?int $id_variation;
    public int $page;
}
