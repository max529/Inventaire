<?php

namespace App\Http\Controllers\Inventaire\Update;

use App\Http\Middlewares\Transaction;
use App\Models\Inventaire;
use App\Models\InventaireHistorique;
use App\Models\User;
use Aventus\Laraventus\Attributes\Rename;
use Aventus\Laraventus\Tools\Console;
use Carbon\Carbon;

#[Rename("InventaireUpdateController")]
class Controller
{
    #[Transaction]
    public function request(Request $request): Inventaire
    {
        $now = Carbon::now();
        $by = User::$current->prenom . ' ' . User::$current->nom;
        if (isset($request->id) && $request->id != 0) {
            /** @var Inventaire $inventaire */
            $inventaire = Inventaire::find($request->id);
            $inventaire->update([
                "quantite" => $request->quantite,
                "last_update" => $now,
                "last_update_by" => $by
            ]);
        } else {
            $inventaire = $request->toModel(Inventaire::class);
            $inventaire->last_update = $now;
            $inventaire->last_update_by = $by;
            $inventaire->save();
        }

        $historique = new InventaireHistorique();
        $historique->id_materiel = $inventaire->id_materiel;
        $historique->id_equipe = $inventaire->id_equipe;
        $historique->id_variation = $inventaire->id_variation;
        $historique->quantite = $inventaire->quantite;
        $historique->last_update = $now;
        $historique->last_update_by = $by;
        $historique->save();

        return $inventaire;
    }
}
