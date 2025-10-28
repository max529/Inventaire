<?php

namespace App\Models;

use App\Observers\VariationTemplateObserver;
use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

/**
 * @property int $id
 * @property int $id_groupe
 * @property string $nom
 */
#[ObservedBy([VariationTemplateObserver::class])]
class VariationTemplate extends AventusModel {
    protected $fillable = [
        "id",
        "id_groupe",
        "nom"
    ];
}
