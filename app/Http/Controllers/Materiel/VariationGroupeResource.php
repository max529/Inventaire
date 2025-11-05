<?php

namespace App\Http\Controllers\Materiel;

use App\Models\VariationGroupe;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<VariationGroupe>
 * @property VariationResource[] $variations
 */
class VariationGroupeResource extends AventusModelResource
{

    public int $id;
    public string $nom;
    public int $id_template;
    public array $variations;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->id_template = $item->id_template;
        $this->variations = VariationResource::collection($item->variations);
    }
}
