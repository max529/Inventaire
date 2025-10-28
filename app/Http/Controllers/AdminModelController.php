<?php

namespace App\Http\Controllers;

use App\Http\Middlewares\IsAdmin;
use Aventus\Laraventus\Attributes\NoExport;
use Aventus\Laraventus\Controllers\ModelController;
use Aventus\Laraventus\Requests\IdsManyRequest;
use Aventus\Laraventus\Requests\ItemsManyRequest;
use Aventus\Laraventus\Resources\AventusModelResource;

/**
 * @template T of AventusModel
 * @template U of AventusRequest
 * @template R of AventusModelResource<T>
 * @template S of R = R
 * @extends ModelController<T, U, R, S>
 */
abstract class AdminModelController extends ModelController
{
    #[NoExport]
    public function index(): array
    {
        return parent::index();
    }

    #[NoExport]
    #[IsAdmin]
    public function store(): AventusModelResource
    {
        return parent::store();
    }


    #[NoExport]
    #[IsAdmin]
    public function storeMany(ItemsManyRequest $request): array
    {
        return parent::storeMany($request);
    }


    #[NoExport]
    public function show(int|string $id): AventusModelResource
    {
        return parent::show($id);
    }


    #[NoExport]
    public function showMany(IdsManyRequest $request): array
    {
        return parent::showMany($request);
    }

    #[NoExport]
    #[IsAdmin]
    public function update(int|string $id): AventusModelResource {
        return parent::update($id);
    }

    #[NoExport]
    #[IsAdmin]
    public function updateMany(ItemsManyRequest $request): array {
        return parent::updateMany($request);
    }

    #[NoExport]
    #[IsAdmin]
    public function destroy(int|string $id): bool {
        return parent::destroy($id);
    }


    #[NoExport]
    #[IsAdmin]
    public function destroyMany(IdsManyRequest $request): bool {
        return parent::destroyMany($request);
    }
}
