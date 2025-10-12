<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Inventaire;

/**
 * @extends MaterielResource
 * @property Inventaire[] $inventaires
 */
class MaterielResourceDetails extends MaterielResource
{

    /**
     * @param Materiel $item
     */
    public function __construct($item, public array $inventaires = [])
    {
        parent::__construct($item);
    }

    public string $test;
    protected function bind($item): void
    {
       parent::bind($item);
    }
}
