<?php

namespace App\Http\Controllers\Materiel;

use App\Models\MaterielEquipe;
use App\Models\MaterielImage;
use App\Models\VariationGroupe;
use Aventus\Laraventus\Attributes\ArrayOf;
use Aventus\Laraventus\Requests\AventusRequest;

/**
 * @property VariationGroupe[] $variations_groupes
 * @property MaterielEquipe[] $equipes
 */
class MaterielRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    public ?MaterielImage $image;
    #[ArrayOf(VariationGroupe::class)]
    public array $variations_groupes;
    public bool $tout_monde;
    #[ArrayOf(MaterielEquipe::class)]
    public array $equipes;
}
