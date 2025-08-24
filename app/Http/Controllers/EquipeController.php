<?php

namespace App\Http\Controllers;

use App\Models\Equipe;
use App\Http\Requests\EquipeRequest;
use App\Http\Resources\EquipeResource;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends ModelController<Equipe, EquipeRequest, EquipeResource>
 */
class EquipeController extends ModelController
{

    public function defineModel(): string
    {
        return Equipe::class;
    }
    public function defineRequest(): string
    {
        return EquipeRequest::class;
    }
    public function defineResource(): string
    {
        return EquipeResource::class;
    }
}

