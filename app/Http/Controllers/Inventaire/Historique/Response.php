<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\Achat;
use App\Models\Mouvement;
use Aventus\Laraventus\Resources\AventusResource;
use Aventus\Laraventus\Tools\Json;
use Carbon\Carbon;

/**
 * @extends AventusResource
 * @property HistoriqueInfo[] $historiques
 */
class Response extends AventusResource
{
    public array $historiques = [];

    public function __construct(
        array $historiques
    ) {
        foreach ($historiques as $historique) {
            $historique =json_decode(json_encode($historique), true);
            $historique["\$type"]  = "App.Http.Controllers.Inventaire.Historique.HistoriqueInfo";
            $historique['date'] = new Carbon($historique['date']);
            $this->historiques[] = Json::toClassObj($historique);
        }
    }
}
