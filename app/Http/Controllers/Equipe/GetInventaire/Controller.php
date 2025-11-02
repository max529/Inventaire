<?php

namespace App\Http\Controllers\Equipe\GetInventaire;

use App\Models\Inventaire;
use Aventus\Laraventus\Attributes\Rename;


#[Rename("EquipeGetInventaireController")]
class Controller
{
    /**
     * @return Response[]
     */
    public function request(Request $request): array
    {
        return Response::collection(
            Inventaire::with(['materiel', 'materiel'])->where('id_equipe', $request->id_equipe)->get()
        );
    }
}
