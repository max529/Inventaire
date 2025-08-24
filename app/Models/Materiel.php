<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Variation;
use App\Models\MaterielImage;

/**
 * @property int $id
 * @property string $nom
 * @property ?MaterielImage $image
 * @property Variation[] $variations
 * @property bool $tout_monde
 */
class Materiel extends AventusModel
{
    public $timestamps = false;


    protected $casts = [
        "image" => MaterielImage::class
    ];


    public function variations(): HasMany
    {
        return $this->hasMany(Variation::class, "id_materiel");
    }
}
