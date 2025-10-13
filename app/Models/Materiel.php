<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Variation;
use App\Models\MaterielImage;
use Aventus\Laraventus\Casts\ToBoolCast;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property int $id
 * @property string $nom
 * @property ?MaterielImage $image
 * @property Collection<Variation> $variations
 * @property bool $tout_monde
 * @property Collection<MaterielEquipe> $equipes
 */
class Materiel extends AventusModel
{
    protected $fillable = [
        "id",
        "nom",
        "image",
        "tout_monde"
    ];
    protected $casts = [
        "image" => MaterielImage::class,
        "tout_monde" => ToBoolCast::class
    ];


    public function variations(): HasMany
    {
        return $this->hasMany(Variation::class, "id_materiel");
    }

    public function equipes(): HasMany
    {
        return $this->hasMany(MaterielEquipe::class, "id_materiel");
    }
}
