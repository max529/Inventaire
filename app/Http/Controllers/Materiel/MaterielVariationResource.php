<?php

namespace App\Http\Controllers\Materiel;

use App\Models\MaterielImage;
use App\Models\MaterielVariation;
use Aventus\Laraventus\Resources\AventusModelResource;
use Aventus\Laraventus\Tools\Console;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends AventusModelResource<MaterielVariation>
 * @property MaterielVariationGroupeResource[] $groups
 */
class MaterielVariationResource extends AventusModelResource
{

    public int $id;
    public array $groups;
    public string $nom;
    public MaterielImage $image;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->groups = MaterielVariationGroupeResource::collection($item->groups);
        $this->nom = $item->materiel->nom;
        $this->image = $item->materiel->image;
    }
}
