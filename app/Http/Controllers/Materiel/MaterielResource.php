<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use App\Models\VariationGroupe;
use App\Models\MaterielImage;
use App\Models\MaterielVariation;
use Aventus\Laraventus\Attributes\DefaultValueRaw;
use Aventus\Laraventus\Resources\AventusModelResource;
use Aventus\Laraventus\Tools\Console;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends AventusModelResource<Materiel>
 * @property MaterielVariationResource[] $variations
 * @property VariationGroupe[] $variations_groupes
 * @property MaterielEquipeResource[] $equipes
 */
class MaterielResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    #[DefaultValueRaw("new MaterielImage()")]
    public MaterielImage $image;
    public array $variations;
    public Collection $variations_groupes;
    public bool $tout_monde;
    public array $equipes;

    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->image = $item->image;
        Console::log(get_class($item->variations[0]));
        $this->variations = MaterielVariationResource::collection($item->variations);
        // $this->variations = [];
        $this->variations_groupes = $item->variations_groupes;
        $this->tout_monde = $item->tout_monde;
        $this->equipes = MaterielEquipeResource::collection($item->equipes);
    }
}
