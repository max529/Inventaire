<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_equipe
 * @property int $id_materiel_variation
 * @property float $quantite
 * @property DateTime $last_update
 * @property string $last_update_by
 * 
 * @property Equipe $equipe
 * @property MaterielVariation $materiel
 */
class Inventaire extends AventusModel
{
    protected $fillable = [
        "id",
        "id_equipe",
        "id_materiel_variation",
        "quantite",
        "last_update",
        "last_update_by",
    ];

    protected $casts = [
        'last_update' => 'datetime'
    ];

    public function materiel(): BelongsTo
    {
        return $this->belongsTo(MaterielVariation::class, "id_materiel_variation");
    }
    public function equipe(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, "id_equipe");
    }
}
