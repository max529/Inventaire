<?php

namespace App\Http\Controllers\VariationGroupeTemplate;

use App\Models\VariationGroupeTemplate;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @extends AventusModelResource<VariationGroupeTemplate>
 * @property VariationTemplateResource[] $variations
 */
class VariationGroupeTemplateResource extends AventusModelResource
{
    public int $id;
    public string $nom;
    public array $variations = [];
    protected function bind($item): void
    {
        $this->id = $item->id;
        $this->nom = $item->nom;
        $this->variations = VariationTemplateResource::collection($item->variations);
    }
}
