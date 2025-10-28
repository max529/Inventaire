<?php

namespace App\Http\Controllers\Equipe\Materiel;

use Aventus\Laraventus\Attributes\Rename;
use Aventus\Laraventus\Requests\AventusRequest;
use Illuminate\Http\UploadedFile;

/**
 * 
 */
#[Rename("EquipeMaterielRequest")]
class Request extends AventusRequest
{
    public int $id_equipe;
}
