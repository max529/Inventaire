<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use Aventus\Laraventus\Controllers\ModelController;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

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

   
    protected function indexAction(): array|Collection|SupportCollection
    {
        return $this->defineModel()::with(['variations.variations', 'variations.materiel'])->get();
    }
}
