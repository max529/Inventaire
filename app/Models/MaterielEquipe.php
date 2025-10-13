<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_materiel
 * @property int $id_equipe
 * @property Equipe $equipe
 * @property Materiel $materiel
 */
class MaterielEquipe extends AventusModel
{

    protected $fillable = [
        "id",
        "id_materiel",
        "id_equipe",
    ];

    public function equipe(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, "id_equipe");
    }

    public function materiel(): BelongsTo
    {
        return $this->belongsTo(Materiel::class, "id_materiel");
    }
}
