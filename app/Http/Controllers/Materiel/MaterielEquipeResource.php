<?php

namespace App\Http\Controllers\Materiel;

use App\Http\Controllers\Equipe\EquipeResource;
use App\Models\MaterielEquipe;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<MaterielEquipe>
 */
class MaterielEquipeResource extends AventusModelResource
{
    public int $id_equipe;
    public EquipeResource $equipe;
    protected function bind($item): void
    {
        $this->id_equipe = $item->id_equipe;
        $this->equipe = new EquipeResource($item->equipe);
    }
}
