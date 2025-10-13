<?php

namespace App\Http\Controllers\User;

use App\Models\User;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends ModelController<User, UserRequest, UserResource>
 */
class UserController extends ModelController
{

    public function defineModel(): string
    {
        return User::class;
    }
    public function defineRequest(): string
    {
        return UserRequest::class;
    }
    public function defineResource(): string
    {
        return UserResource::class;
    }


    protected function updateAction($item): void
    {
        if($item->mot_passe) {
            $item->update();
        }
        else {
            unset($item->mot_passe);
            $item->update();
        }
    }
}

