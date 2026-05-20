<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/run-migrate', function () {
    Artisan::call('migrate', ['--force' => true]);
    return Artisan::output();
});

Route::get('/', function () {
    return view('welcome');
});
