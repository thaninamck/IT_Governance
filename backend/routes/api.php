<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\ApiAuthenticate;

use App\Http\Middleware\CheckPasswordReset;
use App\Http\Middleware\ForcePasswordChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ControlController;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LogController;


/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/



Route::middleware(['auth:sanctum', AdminMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/users', 'index');
            Route::post('/insert-user', 'store');
            Route::post('/reset-user/{id}', 'resetUser');
            Route::patch('/update-user/{id}', 'updateUser');
            Route::patch('/block-user/{id}', 'blockUser');
            Route::patch('/unblock-user/{id}', 'unblockUser');
            Route::delete('/user/{id}', 'deleteUser');
            Route::post('/insert-users', 'storeMultiple');
        });

        
            
        Route::get('/logs', [LogController::class, 'getUserActivityLogs']);




        Route::controller(ControlController::class)->group(function () {
            Route::get('/controls', 'index');
            Route::patch('/update-control/{id}', 'update');
            Route::post('/insert-control', 'store');
            Route::post('/insert-controls', 'multipleStore');
            Route::patch('/archive-control/{id}', 'archiveControl');
            Route::patch('/restore-control/{id}', 'restoreControl');
        });
    });

Route::post('/login', action: [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword', [AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email', [AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
