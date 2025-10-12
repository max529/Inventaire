<?php

namespace App\Http\Controllers\Materiel;

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
