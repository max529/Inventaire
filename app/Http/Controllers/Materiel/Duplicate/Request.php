<?php

namespace App\Http\Controllers\Materiel\Duplicate;

use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
class Request extends AventusRequest
{
    public int $id_materiel;
}
