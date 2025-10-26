<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property int $id_groupe
 * @property ?int $id_variation_template
 * @property string $nom
 */
class Variation extends AventusModel {
    protected $fillable = [
        "id",
        "id_groupe",
        "id_variation_template",
        "nom"
    ];
}
