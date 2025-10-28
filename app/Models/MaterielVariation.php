<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_materiel
 * @property Materiel $materiel
 * @property Collection<int, MaterielVariationGroupe> groups
 */
class MaterielVariation extends AventusModel
{
    protected $fillable = [
        "id",
        "id_materiel"
    ];
    protected $casts = [];

    public function materiel(): BelongsTo
    {
        return $this->belongsTo(Materiel::class, "id_materiel");
    }

    public function groups(): HasMany
    {
        return $this->hasMany(MaterielVariationGroupe::class, "id_materiel_variation");
    }
}
