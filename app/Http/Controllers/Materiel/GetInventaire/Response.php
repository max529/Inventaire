<?php

namespace App\Http\Controllers\Materiel\GetInventaire;

use App\Http\Controllers\Equipe\EquipeResource;
use App\Http\Controllers\Materiel\MaterielVariationResource;
use App\Models\Inventaire;
use Aventus\Laraventus\Resources\AventusModelResource;
use DateTime;

/**
 * @extends AventusModelResource<Inventaire>
 */
class Response extends AventusModelResource
{
    public int $id;
    public EquipeResource $equipe;
    public MaterielVariationResource $materiel;
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
        $this->materiel = new MaterielVariationResource($item->materiel);
        $this->quantite = $item->quantite;
        $this->last_update = $item->last_update;
        $this->last_update_by = $item->last_update_by;
    }
}
