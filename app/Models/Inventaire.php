<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_equipe
 * @property int $id_materiel
 * @property ?int $id_variation
 * @property float $quantite
 * @property DateTime $last_update
 * @property string $last_update_by
 * 
 * @property Equipe $equipe
 * @property Materiel $materiel
 * @property ?Variation $variation
 */
class Inventaire extends AventusModel
{
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

    public function materiel(): BelongsTo
    {
        return $this->belongsTo(Materiel::class, "id_materiel");
    }
    public function equipe(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, "id_equipe");
    }
    public function variation(): BelongsTo
    {
        return $this->belongsTo(Variation::class, "id_variation");
    }
}
