<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Variation;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Variation>
 */
class VariationResource extends AventusModelResource
{

    public int $id;
    public string $nom;
    public int $id_variation_template;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->id_variation_template = $item->id_variation_template;
    }
}
