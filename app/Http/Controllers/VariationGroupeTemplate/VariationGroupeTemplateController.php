<?php

namespace App\Http\Controllers\VariationGroupeTemplate;

use App\Models\VariationGroupeTemplate;
use Aventus\Laraventus\Controllers\ModelController;

/**
 * @extends ModelController<VariationGroupeTemplate, VariationGroupeTemplateRequest, VariationGroupeTemplateResource>
 */
class VariationGroupeTemplateController extends ModelController
{

    public function defineModel(): string
    {
        return VariationGroupeTemplate::class;
    }
    public function defineRequest(): string
    {
        return VariationGroupeTemplateRequest::class;
    }
    public function defineResource(): string
    {
        return VariationGroupeTemplateResource::class;
    }
}
