<?php

namespace App\Http\Controllers;

use App\Models\Materiel;
use App\Http\Requests\MaterielRequest;
use App\Http\Resources\MaterielResource;
use Aventus\Laraventus\Controllers\ModelController;
use Aventus\Laraventus\Tools\Console;

/**
 * @extends ModelController<Materiel, MaterielRequest, MaterielResource>
 */
class MaterielController extends ModelController
{

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

    protected function storeAction($item): void
    {
        $item->save();
        $item->variations()->saveMany($item->variations);
    }

    protected function updateAction($item): void
    {
        $currentItem = $this->defineModel()::find($item->id);
        $existingIds = $currentItem->variations()->pluck('id')->toArray();
        $newVariations = $item->variations;
        $newIds = $newVariations->pluck('id')->filter()->toArray();

        // 1️⃣ Supprimer les variations qui ne sont plus présentes
        $idsToDelete = array_diff($existingIds, $newIds);
        $item->variations()->whereIn('id', $idsToDelete)->delete();

        // 2️⃣ Mettre à jour celles qui existent déjà
        foreach ($newVariations->whereIn('id', $existingIds) as $variationData) {
            $variation = $item->variations()->find($variationData['id']);
            $variation->fill($variationData);
            $variation->save();
        }

        // 3️⃣ Insérer les nouvelles (id == 0 ou null)
        $newOnes = $newVariations->whereNull('id')
            ->merge($newVariations->where('id', 0));

        $item->variations()->createMany($newOnes->toArray());
    }
}
