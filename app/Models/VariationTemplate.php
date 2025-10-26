<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property int $id_groupe
 * @property string $nom
 */
class VariationTemplate extends AventusModel {
    protected $fillable = [
        "id",
        "id_groupe",
        "nom"
    ];
}
