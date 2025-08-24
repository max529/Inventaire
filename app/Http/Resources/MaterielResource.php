<?php

namespace App\Http\Resources;

use App\Models\Materiel;
use App\Models\MaterielImage;
use App\Models\Variation;
use Aventus\Laraventus\Attributes\DefaultValueRaw;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Materiel>
 * @property Variation[] $variations
 */
class MaterielResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    #[DefaultValueRaw("new MaterielImage()")]
    public MaterielImage $image;
    public array $variations;

    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->image = $item->image;
        $this->variations = $item->variations;
    }
}
