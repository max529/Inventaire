<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\Mouvement;
use Aventus\Laraventus\Resources\AventusResource;

/**
 * @extends AventusResource
 * @property Mouvement[] $mouvements
 */
class Response extends AventusResource
{

    public function __construct(
        public array $mouvements
    ) {}
}
