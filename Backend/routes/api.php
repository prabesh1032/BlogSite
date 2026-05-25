<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);

Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/search', [BlogController::class, 'search']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/my-blogs', [BlogController::class, 'myBlogs']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::patch('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
    // Profile endpoints
    Route::get('/user/profile', [ProfileController::class, 'show']);
    Route::match(['put','patch'], '/user/profile', [ProfileController::class, 'update']);
});
