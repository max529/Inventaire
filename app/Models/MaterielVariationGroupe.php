<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Variation;
use App\Models\MaterielImage;
use Aventus\Laraventus\Casts\ToBoolCast;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_materiel_variation
 * @property int $id_variation
 */
class MaterielVariationGroupe extends AventusModel
{
    protected $fillable = [
        "id",
        "id_materiel_variation",
        "id_variation"
    ];
    protected $casts = [];

    public function variation(): BelongsTo
    {
        return $this->belongsTo(Variation::class, "id_variation");
    }
    public function materiel_variation(): BelongsTo
    {
        return $this->belongsTo(MaterielVariation::class, "id_materiel_variation");
    }
}
