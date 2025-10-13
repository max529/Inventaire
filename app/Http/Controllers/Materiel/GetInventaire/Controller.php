<?php

namespace App\Http\Controllers\Materiel\GetInventaire;

use App\Models\Inventaire;
use Aventus\Laraventus\Attributes\Rename;

#[Rename("MaterielGetInventaireController")]
class Controller
{
    /**
     * @return Response[]
     */
    public function request(Request $request): array
    {
        return Response::collection(
            Inventaire::with(['equipe', 'variation'])->where('id_materiel', $request->id_materiel)->get()
        );
    }
}
