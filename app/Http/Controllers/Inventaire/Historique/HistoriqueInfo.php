<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\Achat;
use App\Models\Mouvement;
use Aventus\Laraventus\Attributes\Export;
use Aventus\Laraventus\Resources\AventusResource;
use Carbon\Carbon;

#[Export]
class HistoriqueInfo
{

    public string $type;
    public int $id_materiel_variation;
    public string $par;
    public Carbon $date;
    public string $equipe_entree;
    public ?string $equipe_sortie;
    public float $quantite;

    public function __construct() {}
}
