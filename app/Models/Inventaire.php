<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property int $id_equipe
 * @property int $id_materiel
 * @property ?int $id_variation
 * @property float $quantite
 */
class Inventaire extends AventusModel {
    public $timestamps = false;
}
