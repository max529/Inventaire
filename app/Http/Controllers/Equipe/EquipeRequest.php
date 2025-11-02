<?php

namespace App\Http\Controllers\Equipe;

use Aventus\Laraventus\Requests\AventusRequest;

class EquipeRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
    public ?bool $stock = false;
}
