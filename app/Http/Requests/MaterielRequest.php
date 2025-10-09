<?php

namespace App\Http\Requests;

use App\Models\MaterielEquipe;
use App\Models\MaterielImage;
use App\Models\Variation;
use Aventus\Laraventus\Attributes\ArrayOf;
use Aventus\Laraventus\Requests\AventusRequest;

/**
 * @property Variation[] $variations
 * @property MaterielEquipe[] $equipes
 */
class MaterielRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    public ?MaterielImage $image;
    #[ArrayOf(Variation::class)]
    public array $variations;
    public bool $tout_monde;
    public array $equipes;
}
