<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
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
}

