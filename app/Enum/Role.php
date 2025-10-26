<?php

namespace App\Enum;

use Aventus\Laraventus\Attributes\Export;

#[Export]
enum Role: int
{
    case Admin = 1;
    case User = 2;
}
