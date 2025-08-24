<?php

namespace App\Models;

use Aventus\Laraventus\Attributes\Export;
use Aventus\Laraventus\Models\AventusImage;

#[Export]
class MaterielImage extends AventusImage {

    protected function get_save_directory($model): string {
        return "materiels";
    }
}
