<?php

use App\Http\Controllers\Equipe\EquipeController;
use App\Http\Controllers\Materiel\MaterielController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\VariationGroupeTemplate\VariationGroupeTemplateController;
use App\Http\Middlewares\IsConnected;
use Aventus\Laraventus\Routes\Route;

Route::get('/login', function () {
    return view('login');
});
Route::get('/logout', function () {
    session("user", null);
    return redirect('/login');
});

Route::post('/login', [\App\Http\Controllers\Auth\Login\Controller::class, "request"]);
Route::post('/logout', [\App\Http\Controllers\Auth\Logout\Controller::class, "request"]);


Route::middleware(IsConnected::class)->group(function () {

    Route::prefix("data")->group(function () {
        Route::resourceWithMany('user', UserController::class);
        Route::resourceWithMany('equipe', EquipeController::class);
        Route::post('/equipe/inventaire', [\App\Http\Controllers\Equipe\GetInventaire\Controller::class, "request"]);
        Route::post('/equipe/materiel', [\App\Http\Controllers\Equipe\Materiel\Controller::class, "request"]);
        Route::resourceWithMany('materiel', MaterielController::class);
        Route::post('/materiel/inventaire', [\App\Http\Controllers\Materiel\GetInventaire\Controller::class, "request"]);
        
        Route::post('/inventaire/mouvement', [\App\Http\Controllers\Inventaire\Mouvement\Controller::class, "request"]);
        Route::post('/inventaire/achat', [\App\Http\Controllers\Inventaire\Achat\Controller::class, "request"]);
        Route::post('/inventaire/perte', [\App\Http\Controllers\Inventaire\Perte\Controller::class, "request"]);
        Route::post('/inventaire/historique', [\App\Http\Controllers\Inventaire\Historique\Controller::class, "request"]);
        
        Route::resourceWithMany('variation_groupe_template', VariationGroupeTemplateController::class);
    });


    Route::match(["get"], '/{any}', function () {
        return view('index');
    })->where('any', '.*');
});
