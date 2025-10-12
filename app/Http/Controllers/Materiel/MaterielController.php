<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Inventaire;
use App\Models\Materiel;
use Aventus\Laraventus\Attributes\NoExport;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends ModelController<Materiel, MaterielRequest, MaterielResource, MaterielResourceDetails>
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
    public function defineResourceDetails(): string
    {
        return MaterielResourceDetails::class;
    }

    #[NoExport]
    public function show(int|string $id): MaterielResourceDetails
    {
        $element = $this->defineModel()::find($id);
        $inventaires = Inventaire::where('id_materiel', $id)->get()->toArray();
        return new MaterielResourceDetails($element, $inventaires);
    }
}
