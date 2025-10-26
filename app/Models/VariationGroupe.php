<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $id_materiel
 * @property ?int $id_template
 * @property string $nom
 * @property Collection<Variation> $variations
 */
class VariationGroupe extends AventusModel {
    protected $fillable = [
        "id",
        "id_materiel",
        "id_template",
        "nom",
    ];

    public function variations(): HasMany
    {
        return $this->hasMany(Variation::class, 'id_groupe');
    }
    
}
