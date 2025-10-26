<?php

namespace App\Http\Controllers\VariationGroupeTemplate;

use App\Models\VariationTemplate;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<VariationTemplate>
 */
class VariationTemplateResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
    }
}
