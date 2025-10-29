<?php

namespace App\Http\Controllers\Equipe\GetInventaire;

use App\Http\Controllers\Materiel\MaterielResource;
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
    public MaterielVariationResource $materiel;
    public float $quantite;
    public DateTime $date;
    public string $par;


    /**
     * Define your bindings
     * @param  $item
     * @return void
     */
    protected function bind($item): void {
        $this->id = $item->id;
        $this->materiel = new MaterielVariationResource($item->materiel);
        $this->quantite = $item->quantite;
        $this->date = $item->date;
        $this->par = $item->par;
    }
}
