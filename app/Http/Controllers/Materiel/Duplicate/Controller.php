<?php

namespace App\Http\Controllers\Materiel\Duplicate;

use App\Http\Controllers\Materiel\MaterielResource;
use App\Models\Inventaire;
use App\Models\Materiel;
use App\Models\MaterielEquipe;
use App\Models\VariationGroupe;
use App\Services\MaterielService;
use Aventus\Laraventus\Attributes\Rename;
use Exception;

#[Rename("MaterielDuplicateController")]
class Controller
{
    public function __construct(
        private MaterielService $service
    ) {}

    public function request(Request $request): MaterielResource
    {
        /**
         * @var ?Materiel $materiel
         */
        $materiel = Materiel::find($request->id_materiel);

        if ($materiel == null) {
            throw new Exception("Element introuvable");
        }

        $clone = new Materiel();
        $clone->nom = $materiel->nom . " - copie";
        $clone->tout_monde = $materiel->tout_monde;
        $clone->image = $materiel->image;
        $clone->save();


        foreach ($materiel->variations_groupes as $variation_groupe) {
            $vg = new VariationGroupe();
            $vg->nom = $variation_groupe->nom;
            $vg->id_template = $variation_groupe->id_template;
            $vg->id_materiel = $clone->id;
            $vg->save();
        }

        foreach ($materiel->equipes as $equipe) {
            $eq = new MaterielEquipe();
            $eq->id_materiel = $clone->id;
            $eq->id_equipe = $equipe->id_equipe;
            $eq->save();
        }

        $materiel = Materiel::find($clone->id);
        $this->service->checkVariations($materiel);
        return new MaterielResource($materiel);
    }
}
