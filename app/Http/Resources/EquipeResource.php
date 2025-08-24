<?php

namespace App\Http\Resources;

use App\Models\Equipe;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<Equipe>
 */
class EquipeResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
    }
}
