<?php

namespace App\Http\Controllers\Equipe\Materiel;

use App\Http\Controllers\Materiel\MaterielResource;
use App\Models\Materiel;
use Aventus\Laraventus\Attributes\Rename;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

#[Rename("EquipeMaterielController")]
class Controller
{
    /**
     * @return MaterielResource[]
     */
    public function request(Request $request): array
    {
        /** @var Collection<int, Materiel> */
        $materiels = Materiel::where('tout_monde', 1)->orWhereHas('equipes', function (Builder $query) use($request) {
            $query->where('id_equipe', $request->id_equipe);
        })->get();

        return MaterielResource::collection($materiels);
    }
}
