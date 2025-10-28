<?php

namespace App\Http\Controllers\Materiel;

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

    public array $groups;
    protected function bind($item): void
    {
        $this->groups = MaterielVariationGroupeResource::collection($item->groups);
    }
}
