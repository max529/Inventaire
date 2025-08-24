<?php

namespace App\Http\Requests;

use App\Models\MaterielImage;
use App\Models\Variation;
use Aventus\Laraventus\Requests\AventusRequest;

/**
 * @property Variation[] $variations
 */
class MaterielRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    public ?MaterielImage $image;
    public array $variations;
}
