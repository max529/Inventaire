<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends ModelController<Materiel, MaterielRequest, MaterielResource>
 */
class MaterielController extends ModelController
{

    public function defineModel(): string
    {
        return Materiel::class;
    }
    public function defineRequest(): string
    {
        return MaterielRequest::class;
    }
    public function defineResource(): string
    {
        return MaterielResource::class;
    }
}
