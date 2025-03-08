<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\ApiAuthenticate;

use App\Http\Middleware\CheckPasswordReset;
use App\Http\Middleware\ForcePasswordChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AuthController;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/



Route::middleware(['auth:sanctum',AdminMiddleware::class])->prefix('v1')->controller(UserController::class)->group(function() {
    Route::get('/users',  'index');
Route::post('/insert-user',  'store');
Route::post('/reset-user/{id}',  'resetUser');

Route::patch('/update-user/{id}',  'updateUser');
Route::patch('/block-user/{id}',  'blockUser');
Route::patch('/unblock-user/{id}',  'unblockUser');
Route::delete('/user/{id}',  'deleteUser');
Route::post('/insert-users',  'storeMultiple');
});

Route::post('/login',action: [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword',[AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email',[AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::patch('/block-user/{id}',  [UserController::class,'blockUser']);
Route::patch('/unblock-user/{id}',  [UserController::class,'unblockUser']);
Route::patch('/update-user/{id}',  [UserController::class,'updateUser']);
Route::patch('/insert-user',  [UserController::class,'store']);
Route::post('/insert-users',  [UserController::class,'storeMultiple']);
Route::post('/reset-user/{id}',  [UserController::class,'resetUser']);
Route::delete('/user/{id}',  [UserController::class,'deleteUser']);

