<?php

namespace App\Http\Controllers\Materiel\GetInventaire;

use App\Http\Controllers\Equipe\EquipeResource;
use App\Http\Controllers\Materiel\MaterielResource;
use App\Models\Inventaire;
use App\Models\Variation;
use Aventus\Laraventus\Resources\AventusModelResource;
use DateTime;

/**
 * @extends AventusModelResource<Inventaire>
 */
class Response extends AventusModelResource
{
    public int $id;
    public EquipeResource $equipe;
    public ?Variation $variation;
    public float $quantite;
    public DateTime $last_update;
    public string $last_update_by;


    /**
     * Define your bindings
     * @param  $item
     * @return void
     */
    protected function bind($item): void {
        $this->id = $item->id;
        $this->equipe = new EquipeResource($item->equipe);
        $this->variation = $item->variation;
        $this->quantite = $item->quantite;
        $this->last_update = $item->last_update;
        $this->last_update_by = $item->last_update_by;
    }
}
