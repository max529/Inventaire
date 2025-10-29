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
    #[Transaction]
    public function request(Request $request): Inventaire
    {
        $now = Carbon::now();
        $by = User::$current->prenom . ' ' . User::$current->nom;

         /** @var Inventaire $inventaire */
        $inventaire = Inventaire::find($request->id_sortie);
        if($inventaire->quantite < $request->quantite) {
            throw new Exception("Stock insuffisant");
        }
        $inventaire->update([
            "quantite" => $inventaire->quantite - $request->quantite,
            "date" => $now,
            "par" => $by
        ]);

        if (isset($request->id_entree) && $request->id_entree != 0) {
            /** @var Inventaire $inventaire */
            $inventaire = Inventaire::find($request->id_entree);
            $inventaire->update([
                "quantite" => $inventaire->quantite + $request->quantite,
                "date" => $now,
                "par" => $by
            ]);
        } else {
            $inventaire = $request->toModel(Inventaire::class);
            $inventaire->id_equipe = $request->id_equipe_entree;
            $inventaire->id_materiel_variation = $request->id_materiel_variation;
            $inventaire->quantite = $request->quantite;
            $inventaire->date = $now;
            $inventaire->par = $by;
            $inventaire->save();
        }

       

        $mouvement = new Mouvement();
        $mouvement->id_materiel_variation = $inventaire->id_materiel_variation;
        $mouvement->id_equipe_entree = $request->id_equipe_entree;
        $mouvement->id_equipe_sortie = $request->id_equipe_sortie;
        $mouvement->quantite = $request->quantite;
        $mouvement->date = $now;
        $mouvement->par = $by;
        $mouvement->save();

        return $inventaire;
    }
}
