<?php

namespace App\Models;

use Aventus\Laraventus\Casts\ToBoolCast;
use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property string $nom
 * @property bool $favori
 */
class Equipe extends AventusModel
{

    protected $fillable = [
        "id",
        "nom",
        "favori"
    ];

    protected $casts = [
        "favori" => ToBoolCast::class
    ];
}
