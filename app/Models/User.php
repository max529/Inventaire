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
class User extends AventusModel {
    #[NoExport]
    public static User $current;
}
