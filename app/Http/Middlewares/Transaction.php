<?php

namespace App\Http\Middlewares;

use Attribute;
use Aventus\Laraventus\Attributes\Middleware;
use Aventus\Laraventus\Helpers\AventusError;
use Aventus\Laraventus\Helpers\LaravelResult;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as HttpResponse;

#[Attribute(Attribute::TARGET_METHOD)]
class Transaction extends Middleware
{
    public function __construct() {
        parent::__construct(Transaction::class);
    }

    public function handle(Request $request, Closure $next): Response
    {
        DB::beginTransaction();

        try {
            $response = $next($request);

            if ($response instanceof Response) {
                if ($response instanceof JsonResponse || $response instanceof HttpResponse) {
                    $data = $response->getOriginalContent();

                    if ($data instanceof LaravelResult && count($data->errors) > 0) {
                        DB::rollBack();
                    } else if ($data instanceof AventusError) {
                        DB::rollBack();
                    } else {
                        DB::commit();
                    }
                } else {
                    DB::commit();
                }
            }

            return $response;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}