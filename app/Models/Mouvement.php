<?php

namespace App\Models;

use Aventus\Laraventus\Models\AventusModel;
use DateTime;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $id_equipe_sortie
 * @property int $id_equipe_entree
 * @property int $id_materiel_variation
 * @property float $quantite
 * @property DateTime $date
 * @property string $par
 * @property string $commentaire
 * 
 * @property Equipe $equipe_sortie
 * @property Equipe $equipe_entree
 * @property MaterielVariation $materiel
 */
class Mouvement extends AventusModel
{
    protected $fillable = [
        "id",
        "id_equipe",
        "id_materiel_variation",
        "quantite",
        "date",
        "par",
        "commentaire"
    ];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function materiel(): BelongsTo
    {
        return $this->belongsTo(MaterielVariation::class, "id_materiel_variation");
    }
    public function equipe_entree(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, "id_equipe_entree");
    }
    public function equipe_sortie(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, "id_equipe_sortie");
    }
}
