<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use App\Models\MaterielImage;
use Aventus\Laraventus\Attributes\DefaultValueRaw;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Materiel>
 * @property MaterielVariationResource[] $variations
 * @property VariationGroupeResource[] $variations_groupes
 * @property MaterielEquipeResource[] $equipes
 */
class MaterielResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    #[DefaultValueRaw("new MaterielImage()")]
    public MaterielImage $image;
    public array $variations;
    public array $variations_groupes;
    public bool $tout_monde;
    public array $equipes;
    public float $stock;
    public $inventaires;

    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->image = $item->image;
        $this->variations = MaterielVariationResource::collection($item->variations);
        $this->variations_groupes = VariationGroupeResource::collection($item->variations_groupes);
        $this->tout_monde = $item->tout_monde;
        $this->equipes = MaterielEquipeResource::collection($item->equipes);
        $this->stock = $item->total_stock_loaded();
        $this->inventaires = $item->inventaires;
    }
}
