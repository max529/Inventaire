<?php

namespace App\Http\Controllers\Inventaire\Achat;

use App\Http\Middlewares\Transaction;
use App\Models\Achat;
use App\Models\Inventaire;
use App\Models\User;
use Aventus\Laraventus\Attributes\Rename;
use Carbon\Carbon;

#[Rename("InventaireAchatController")]
class Controller
{
    #[Transaction]
    public function request(Request $request): Inventaire
    {
        $now = Carbon::now();
        $by = User::$current->prenom . ' ' . User::$current->nom;
        /** @var ?Inventaire $inventaire */
        $inventaire = Inventaire::where('id_materiel_variation', $request->id_materiel_variation)->where('id_equipe', $request->id_equipe)->first();
        if ($inventaire != null) {
            $inventaire->update([
                "quantite" => $inventaire->quantite + $request->quantite,
                "date" => $now,
                "par" => $by
            ]);
        } else {
            $inventaire = $request->toModel(Inventaire::class);
            $inventaire->id_equipe = $request->id_equipe;
            $inventaire->id_materiel_variation = $request->id_materiel_variation;
            $inventaire->quantite = $request->quantite;
            $inventaire->date = $now;
            $inventaire->par = $by;
            $inventaire->save();
        }

        $achat = new Achat();
        $achat->id_materiel_variation = $inventaire->id_materiel_variation;
        $achat->id_equipe = $inventaire->id_equipe;
        $achat->quantite = $request->quantite;
        $achat->date = $now;
        $achat->par = $by;
        $achat->commentaire = $request->commentaire;
        $achat->save();

        return $inventaire;
    }
}
