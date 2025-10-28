<?php

namespace App\Http\Controllers\Equipe;

use App\Http\Controllers\AdminModelController;
use App\Models\Equipe;
use App\Models\Inventaire;
use Aventus\Laraventus\Attributes\NoExport;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends AdminModelController<Equipe, EquipeRequest, EquipeResource>
 */
class EquipeController extends AdminModelController
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

