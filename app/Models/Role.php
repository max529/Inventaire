<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property string $nom
 */
class Role extends AventusModel {
    protected $fillable = [
        "id",
        "nom"
    ];
}
