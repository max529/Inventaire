<?php

namespace App\Http\Resources;

use App\Models\Equipe;
use App\Models\Materiel;
use App\Models\MaterielImage;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<MaterielImage>
 */
class MaterielImageResource extends AventusModelResource
{
    public int $uri;
    protected function bind($item): void
    {
        $this->uri = $item->uri;
    }
}
