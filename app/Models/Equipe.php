<?php

namespace App\Models;

use Aventus\Laraventus\Casts\ToBoolCast;
use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property string $nom
 * @property bool $stock
 */
class Equipe extends AventusModel
{

    protected $fillable = [
        "id",
        "nom",
        "stock"
    ];

    protected $casts = [
        "stock" => ToBoolCast::class
    ];
}
