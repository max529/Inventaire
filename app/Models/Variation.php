<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property int $id_materiel
 * @property string $nom
 */
class Variation extends AventusModel {
    public $timestamps = false;
}
