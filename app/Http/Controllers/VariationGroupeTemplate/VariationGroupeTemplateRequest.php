<?php

namespace App\Http\Controllers\VariationGroupeTemplate;

use Aventus\Laraventus\Attributes\ArrayOf;
use Aventus\Laraventus\Requests\AventusRequest;

/**
 * @property VariationTemplateRequest[] $variations
 */
class VariationGroupeTemplateRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    #[ArrayOf(VariationTemplateRequest::class)]
    public array $variations = [];

    protected function save_links(): null|array
    {
        return [
            "variations"
        ];
    }
}
