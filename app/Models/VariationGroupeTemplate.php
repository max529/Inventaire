<?php

namespace App\Models;

use App\Observers\VariationTemplateObserver;
use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nom
 * @property Collection<int, VariationTemplate> $variations
 */
#[ObservedBy([VariationGroupeTemplateObserver::class])]
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
