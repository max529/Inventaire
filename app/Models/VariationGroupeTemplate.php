<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nom
 * @property Collection<VariationTemplate> $variations
 */
class VariationGroupeTemplate extends AventusModel
{
    protected $fillable = [
        "id",
        "nom"
    ];

    public function variations(): HasMany
    {
        return $this->hasMany(VariationTemplate::class, 'id_groupe');
    }
}
