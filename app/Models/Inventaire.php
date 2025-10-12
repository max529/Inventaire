<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use DateTime;

/**
 * @property int $id
 * @property int $id_equipe
 * @property int $id_materiel
 * @property ?int $id_variation
 * @property float $quantite
 * @property DateTime $lastUpdate
 * @property string $lastUpdateBy
 */
class Inventaire extends AventusModel {
}
