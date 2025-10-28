<?php

namespace App\Http\Controllers\Materiel;

use App\Models\MaterielVariation;
use App\Models\MaterielVariationGroupe;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<MaterielVariationGroupe>
 */
class MaterielVariationGroupeResource extends AventusModelResource
{
    public VariationResource $variation;
    protected function bind($item): void
    {
        $this->variation = new VariationResource($item->variation);
    }
}
