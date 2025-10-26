<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use App\Models\VariationGroupe;
use App\Models\MaterielImage;
use App\Models\MaterielVariation;
use Aventus\Laraventus\Attributes\DefaultValueRaw;
use Aventus\Laraventus\Resources\AventusModelResource;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends AventusModelResource<Materiel>
 * @property MaterielVariation[] $variations
 * @property VariationGroupe[] $variations_groupes
 * @property MaterielEquipeResource[] $equipes
 */
class MaterielResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    #[DefaultValueRaw("new MaterielImage()")]
    public MaterielImage $image;
    public Collection $variations;
    public Collection $variations_groupes;
    public bool $tout_monde;
    public array $equipes;

    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->image = $item->image;
        $this->variations = $item->variations;
        $this->variations_groupes = $item->variations_groupes;
        $this->tout_monde = $item->tout_monde;
        $this->equipes = MaterielEquipeResource::collection($item->equipes);
    }
}
