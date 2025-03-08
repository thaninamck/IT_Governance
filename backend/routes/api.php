<?php

use App\Http\Middleware\CheckPasswordReset;
use App\Http\Middleware\ForcePasswordChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Middleware\EnsureUserIsAdmin;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/


Route::prefix('v1')->controller(UserController::class)->group(function() {
    Route::get('/hello', 'sayHello');
    
});

Route::prefix('v1')->controller(ClientController::class)->group(function() {
    Route::post('/createclient', 'store');
    
});
Route::prefix('v1')->controller(ClientController::class)->group(function() {
    Route::get('/getclients', 'index');
    
});

Route::prefix('v1')->controller(ClientController::class)->group(function() {
    Route::delete('/deleteclientID/{id}', 'deleteClient');
    
});
Route::prefix('v1')->controller(ClientController::class)->group(function() {
    Route::put('/updateclientID/{id}', 'updateClient');
    
});
Route::prefix('v1')->controller(ClientController::class)->group(function() {
    Route::post('/insertclients', 'storeMultiple');
    
});


Route::post('/login',action: [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword',[AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email',[AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);

Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


