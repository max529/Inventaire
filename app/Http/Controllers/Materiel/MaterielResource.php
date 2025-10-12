<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use App\Models\MaterielImage;
use App\Models\Variation;
use Aventus\Laraventus\Attributes\DefaultValueRaw;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Materiel>
 * @property Variation[] $variations
 * @property MaterielEquipeResource[] $equipes
 */
class MaterielResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    #[DefaultValueRaw("new MaterielImage()")]
    public MaterielImage $image;
    public array $variations;
    public bool $tout_monde;
    public array $equipes;

    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->image = $item->image;
        $this->variations = $item->variations->toArray();
        $this->tout_monde = $item->tout_monde;
        $this->equipes = MaterielEquipeResource::collection($item->equipes);
        // $this->inventaires = InventaireResource::collection($item->);
    }
}
