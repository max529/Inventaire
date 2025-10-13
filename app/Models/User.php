<?php

namespace App\Models;

use Aventus\Laraventus\Attributes\NoExport;
use Aventus\Laraventus\Models\AventusModel;

/**
 * @property int $id
 * @property string $nom
 * @property string $prenom
 * @property string $nom_utilisateur
 * @property string $mot_passe
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
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mot_passe' => 'hashed'
        ];
    }
}
