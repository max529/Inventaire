<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EquipeController;
use App\Http\Controllers\MaterielController;
use App\Http\Controllers\UserController;
use App\Http\Middlewares\IsConnected;
use Illuminate\Support\Facades\Route;



Route::get('/login', function () {
    return view('login');
});
Route::get('/logout', function () {
    session("user", null);
    return redirect('/login');
});

Route::post('/login', [AuthController::class, "login"]);


Route::middleware(IsConnected::class)->group(function () {

    Route::prefix("data")->group(function () {
        Route::resource('user', UserController::class);
        Route::resource('equipe', EquipeController::class);
        Route::resource('materiel', MaterielController::class);
    });


    Route::match(["get"], '/{any}', function () {
        return view('index');
    })->where('any', '.*');
});
