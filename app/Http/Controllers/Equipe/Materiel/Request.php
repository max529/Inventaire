<?php

namespace App\Http\Controllers\Equipe\Materiel;

use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public int $id_equipe;
}
