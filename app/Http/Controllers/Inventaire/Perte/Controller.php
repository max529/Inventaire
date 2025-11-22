<?php

namespace App\Http\Controllers\Inventaire\Perte;

use App\Http\Middlewares\IsAdmin;
use App\Http\Middlewares\Transaction;
use App\Models\Achat;
use App\Models\Inventaire;
use App\Models\Perte;
use App\Models\User;
use Aventus\Laraventus\Attributes\Rename;
use Carbon\Carbon;
use Exception;

#[Rename("InventairePerteController")]
class Controller
{
    #[IsAdmin]
    #[Transaction]
    public function request(Request $request): Inventaire
    {
        $now = Carbon::now();
        $by = User::$current->prenom . ' ' . User::$current->nom;
        /** @var ?Inventaire $inventaire */
        $inventaire = Inventaire::where('id_materiel_variation', $request->id_materiel_variation)->where('id_equipe', $request->id_equipe)->first();
        if ($inventaire == null || $inventaire->quantite < $request->quantite) {
            throw new Exception("Stock insuffisant");
        }
        $inventaire->update([
            "quantite" => $inventaire->quantite - $request->quantite,
            "date" => $now,
            "par" => $by
        ]);


        $perte = new Perte();
        $perte->id_materiel_variation = $inventaire->id_materiel_variation;
        $perte->id_equipe = $inventaire->id_equipe;
        $perte->quantite = $request->quantite;
        $perte->date = $now;
        $perte->par = $by;
        $perte->commentaire = $request->commentaire;
        $perte->save();

        return $inventaire;
    }
}
