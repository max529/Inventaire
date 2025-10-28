<?php

namespace App\Observers;

use App\Models\Materiel;
use App\Models\Variation;
use App\Models\VariationTemplate;
use App\Services\MaterielService;
use Illuminate\Database\Eloquent\Collection;

class VariationTemplateObserver
{
    public function __construct(
        private MaterielService $materielService
    )
    {

    }

    public function created(VariationTemplate $item): void
    {
        /** @var Collection<int, Materiel> $materiels */
        $materiels = Materiel::whereHas("variations_groupes", function ($query) use ($item) {
            $query->where("id_template", $item->id_groupe);
        })->get();

        foreach ($materiels as $materiel) {
            $this->materielService->checkVariations($materiel);
        }
    }


    public function updated(VariationTemplate $item): void
    {
        Variation::where('id_variation_template', $item->id)->update([
            "nom" => $item->nom,
        ]);
    }

    public function deleted(VariationTemplate $item): void
    {
        /** @var Collection<int, Materiel> $materiels */
        $materiels = Materiel::whereHas("variations_groupes", function ($query) use ($item) {
            $query->where("id_template", $item->id_groupe);
        })->get();

        foreach ($materiels as $materiel) {
            $this->materielService->checkVariations($materiel);
        }
    }
}
