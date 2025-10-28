<?php

namespace App\Observers;

use App\Models\Materiel;
use App\Models\VariationGroupe;
use App\Models\VariationGroupeTemplate;
use App\Services\MaterielService;
use Illuminate\Database\Eloquent\Collection;

class VariationGroupeTemplateObserver
{
    public function __construct(
        private MaterielService $materielService
    )
    {
    }

    public function created(VariationGroupeTemplate $item): void
    {
        /** @var Collection<int, Materiel> $materiels */
        $materiels = Materiel::whereHas("variations_groupes", function ($query) use ($item) {
            $query->where("id_template", $item->id);
        })->get();

        foreach ($materiels as $materiel) {
            $this->materielService->checkVariations($materiel);
        }
    }


    public function updated(VariationGroupeTemplate $item): void
    {
        VariationGroupe::where('id_template', $item->id)->update([
            "nom" => $item->nom,
        ]);
    }

    public function deleted(VariationGroupeTemplate $item): void
    {
        /** @var Collection<int, Materiel> $materiels */
        $materiels = Materiel::whereHas("variations_groupes", function ($query) use ($item) {
            $query->where("id_template", $item->id);
        })->get();

        foreach ($materiels as $materiel) {
            $this->materielService->checkVariations($materiel);
        }
    }
}
