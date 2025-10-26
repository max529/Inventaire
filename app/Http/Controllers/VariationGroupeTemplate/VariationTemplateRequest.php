<?php

namespace App\Http\Controllers\VariationGroupeTemplate;

use Aventus\Laraventus\Attributes\Export;

#[Export]
class VariationTemplateRequest
{
    public ?int $id;
    public string $nom;
}
