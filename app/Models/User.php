<?php

namespace App\Models;

use App\Enum\Role;
use Aventus\Laraventus\Attributes\NoExport;
use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property string $nom
 * @property string $prenom
 * @property string $nom_utilisateur
 * @property string $mot_passe
 * @property Role $id_role
 * 
 * @noExportProperty $mot_passe
 */
class User extends AventusModel
{
    #[NoExport]
    public static User $current;

    protected $fillable = [
        "id",
        "nom",
        "prenom",
        "nom_utilisateur",
        "mot_passe",
        "id_role"
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mot_passe' => 'hashed',
            'id_role' => Role::class
        ];
    }
}
