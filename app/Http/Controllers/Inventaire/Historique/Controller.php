<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\Mouvement;
use Aventus\Laraventus\Attributes\Rename;
use Illuminate\Database\Eloquent\Collection;

#[Rename("InventaireHistoriqueController")]
class Controller
{
    public function request(Request $request): Response
    {
        $query = Mouvement::where('id_equipe', $request->id_equipe)
            ->where('id_materiel_variation', $request->id_materiel_variation)
            ->orderBy('date', 'desc');

        $limit = 20;
        $query->offset($request->page * $limit);
        $query->limit($limit);

        /** @var Collection<int, Mouvement> */
        $mouvements = $query->get();

        return new Response($mouvements->all());
    }
}
