<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\InventaireHistorique;
use Aventus\Laraventus\Attributes\Rename;
use Illuminate\Database\Eloquent\Collection;

#[Rename("InventaireHistoriqueController")]
class Controller
{
    public function request(Request $request): Response
    {
        $query = InventaireHistorique::where('id_equipe', $request->id_equipe)
            ->where('id_materiel', $request->id_materiel)
            ->orderBy('last_update', 'desc');
        if (isset($request->id_variation)) {
            $query->where('id_variation', $request->id_variation);
        } else {
            $query->whereNull('id_variation');
        }

        $limit = 20;
        $query->offset($request->page * $limit);
        $query->limit($limit);

        /** @var Collection<InventaireHistorique> */
        $historique = $query->get();

        return new Response($historique->all());
    }
}
