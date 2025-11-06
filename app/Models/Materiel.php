<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Variation;
use App\Models\MaterielImage;
use Aventus\Laraventus\Casts\ToBoolCast;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @property int $id
 * @property string $nom
 * @property ?MaterielImage $image
 * @property Collection<int, MaterielVariation> $variations
 * @property Collection<int, VariationGroupe> $variations_groupes
 * @property bool $tout_monde
 * @property Collection<int, MaterielEquipe> $equipes
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
        return $this->hasMany(MaterielVariation::class, "id_materiel");
    }

    public function equipes(): HasMany
    {
        return $this->hasMany(MaterielEquipe::class, "id_materiel");
    }

    public function variations_groupes(): HasMany
    {
        return $this->hasMany(VariationGroupe::class, "id_materiel");
    }

    public function inventaires(): HasManyThrough
    {
        return $this->hasManyThrough(
            Inventaire::class,
            MaterielVariation::class,
            'id_materiel',            // clé étrangère sur MaterielVariation
            'id_materiel_variation',  // clé étrangère sur Inventaire
            'id',                     // clé locale sur Materiel
            'id'                      // clé locale sur MaterielVariation
        );
    }

    public function total_stock()
    {
        return $this->inventaires()
            ->whereHas('equipe', fn($q) => $q->where('stock', true))
            ->sum('quantite');
    }

    public function total_stock_loaded(): float
    {
        return $this->variations
            ->flatMap(fn($v) => $v->inventaires)
            ->filter(fn($i) => $i->equipe?->stock)
            ->sum('quantite');
    }
}
