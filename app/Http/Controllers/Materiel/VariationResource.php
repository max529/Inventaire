<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Variation;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Variation>
 */
class VariationResource extends AventusModelResource
{

    public string $nom;
    protected function bind($item): void
    {
        $this->nom = $item->nom;
    }
}
