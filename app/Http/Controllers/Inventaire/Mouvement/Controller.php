<?php

namespace App\Http\Controllers\Inventaire\Mouvement;

use App\Http\Middlewares\Transaction;
use App\Models\Inventaire;
use App\Models\Mouvement;
use App\Models\User;
use Aventus\Laraventus\Attributes\Rename;
use Carbon\Carbon;
use Exception;

#[Rename("InventaireMouvementController")]
class Controller
{
    /**
     * @return Inventaire[]
     */
    #[Transaction]
    public function request(Request $request): array
    {
        $now = Carbon::now();
        $by = User::$current->prenom . ' ' . User::$current->nom;

        /** @var ?Inventaire $inventaireSortie */
        $inventaireSortie = Inventaire::where('id_materiel_variation', $request->id_materiel_variation)->where('id_equipe', $request->id_equipe_sortie)->first();
        if ($inventaireSortie == null || $inventaireSortie->quantite < $request->quantite) {
            throw new Exception("Stock insuffisant");
        }
        $inventaireSortie->update([
            "quantite" => $inventaireSortie->quantite - $request->quantite,
            "date" => $now,
            "par" => $by
        ]);

        /** @var ?Inventaire $inventaire */
        $inventaireEntree = Inventaire::where('id_materiel_variation', $request->id_materiel_variation)->where('id_equipe', $request->id_equipe_entree)->first();

        if ($inventaireEntree != null) {
            $inventaireEntree->update([
                "quantite" => $inventaireEntree->quantite + $request->quantite,
                "date" => $now,
                "par" => $by
            ]);
        } else {
            $inventaireEntree = $request->toModel(Inventaire::class);
            $inventaireEntree->id_equipe = $request->id_equipe_entree;
            $inventaireEntree->id_materiel_variation = $request->id_materiel_variation;
            $inventaireEntree->quantite = $request->quantite;
            $inventaireEntree->date = $now;
            $inventaireEntree->par = $by;
            $inventaireEntree->save();
        }



        $mouvement = new Mouvement();
        $mouvement->id_materiel_variation = $inventaireEntree->id_materiel_variation;
        $mouvement->id_equipe_entree = $request->id_equipe_entree;
        $mouvement->id_equipe_sortie = $request->id_equipe_sortie;
        $mouvement->quantite = $request->quantite;
        $mouvement->date = $now;
        $mouvement->par = $by;
        $mouvement->save();

        return [$inventaireSortie, $inventaireEntree];
    }
}
