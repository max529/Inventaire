<?php

namespace App\Http\Controllers\Inventaire\Historique;

use App\Models\Mouvement;
use Aventus\Laraventus\Attributes\Rename;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

#[Rename("InventaireHistoriqueController")]
class Controller
{
    public function request(Request $request): Response
    {
        $limit = 20;

        $results = DB::select("
            SELECT 'achat' AS type, id_materiel_variation, par, date, equipes.nom AS equipe_entree, NULL AS equipe_sortie, quantite, commentaire
            FROM achats
            inner join equipes on equipes.id = achats.id_equipe
            WHERE id_materiel_variation = :id_materiel_variation1 
            AND id_equipe = :id_equipe

            UNION

            SELECT 'perte' AS type, id_materiel_variation, par, date, equipes.nom AS equipe_entree, NULL AS equipe_sortie, quantite, commentaire
            FROM pertes
            inner join equipes on equipes.id = pertes.id_equipe
            WHERE id_materiel_variation = :id_materiel_variation2 
            AND id_equipe = :id_equipe2

            UNION

            SELECT 'mouvement' AS type, id_materiel_variation, par, date, equipes1.nom AS equipe_entree, equipes2.nom AS equipe_sortie, quantite, commentaire
            FROM mouvements
            inner join equipes equipes1 on equipes1.id = mouvements.id_equipe_entree
            inner join equipes equipes2 on equipes2.id = mouvements.id_equipe_sortie
            WHERE id_materiel_variation = :id_materiel_variation3
            AND (id_equipe_entree = :id_equipe_entree OR id_equipe_sortie = :id_equipe_sortie)

            ORDER BY date DESC
            limit :limit offset :offset
        ", [
            'id_materiel_variation1' => $request->id_materiel_variation,
            'id_materiel_variation2' => $request->id_materiel_variation,
            'id_materiel_variation3' => $request->id_materiel_variation,
            'id_equipe' => $request->id_equipe,
            'id_equipe2' => $request->id_equipe,
            'id_equipe_entree' => $request->id_equipe,
            'id_equipe_sortie' => $request->id_equipe,
            'limit' => $limit,
            'offset' => $request->page * $limit,
        ]);

        return new Response($results);
    }
}
