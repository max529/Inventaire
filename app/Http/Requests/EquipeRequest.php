<?php

namespace App\Http\Requests;

use Aventus\Laraventus\Requests\AventusRequest;

class EquipeRequest extends AventusRequest
{
    public ?int $id;
    public string $nom;
}
