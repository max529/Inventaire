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
 * @property DateTime $last_update
 * @property string $last_update_by
 */
class InventaireHistorique extends AventusModel {
    protected $fillable = [
        "id",
        "id_equipe",
        "id_materiel",
        "id_variation",
        "quantite",
        "last_update",
        "last_update_by",
    ];

    protected $casts = [
        'last_update' => 'datetime'
    ];
}
