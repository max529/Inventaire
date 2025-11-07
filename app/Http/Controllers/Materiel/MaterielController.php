<?php

namespace App\Http\Controllers\Materiel;

use App\Models\Materiel;
use App\Models\MaterielVariation;
use App\Models\MaterielVariationGroupe;
use App\Models\Variation;
use App\Models\VariationGroupe;
use App\Services\MaterielService;
use Aventus\Laraventus\Controllers\ModelController;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

/**
 * @extends ModelController<Materiel, MaterielRequest, MaterielResource>
 */
class MaterielController extends ModelController
{
    public function __construct(
        private MaterielService $materielService,
    )
    {

    }

    public function defineModel(): string
    {
        return Materiel::class;
    }

    public function defineRequest(): string
    {
        return MaterielRequest::class;
    }

    public function defineResource(): string
    {
        return MaterielResource::class;
    }


    protected function indexAction(): Collection
    {
        return $this->defineModel()::with(['variations.groups.variation', 'variations.materiel', 'variations.inventaires.equipe'])->get();
    }

    protected function storeAction($item): void
    {
        parent::storeAction($item);
        $this->materielService->checkVariations($item);
    }

    protected function updateAction($item): void
    {
        parent::updateAction($item);
        $this->materielService->checkVariations($item);
    }
}
