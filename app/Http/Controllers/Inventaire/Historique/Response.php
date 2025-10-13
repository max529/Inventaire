<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\InventaireHistorique;
use Aventus\Laraventus\Resources\AventusResource;

/**
 * @extends AventusResource
 * @property InventaireHistorique[] $historique
 */
class Response extends AventusResource
{

    public function __construct(
        public array $historique
    ) {}
}
