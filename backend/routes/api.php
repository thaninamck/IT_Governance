<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\ApiAuthenticate;

use App\Http\Middleware\CheckPasswordReset;
use App\Http\Middleware\ForcePasswordChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\LogController;
use App\Http\Controllers\Api\V1\MissionController;
use App\Http\Controllers\Api\V1\OwnerController;
use App\Http\Controllers\Api\V1\SystemController;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/

Route::prefix('v1')->group(function () { 
    Route::controller(MissionController::class)->group(function () {
        Route::get('/getmissions', 'index');
    });
});

Route::middleware(['auth:sanctum', AdminMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        Route::controller(MissionController::class)->group(function () {
           // Route::get('/getmissions', 'index');
           // Route::post('/createmissions', 'store');
           // Route::put('/updatemissionID/{id}', 'updateMission');
           // Route::delete('/deletemissionID/{id}', 'deleteMission');
            Route::post('/insertmissions', 'storeMultiple');
            // Route::put('/closemission/{id}', 'closeMission');
           // Route::put('/archivemission/{id}', 'archiveMission');
            // Route::put('/cancelmission/{id}', 'cancelMission');
            // Route::put('/stopmission/{id}', 'stopMission');
           // Route::put('/resumemission/{id}', 'resumeMission');
            Route::get('/archivedmissions', 'getArchivedMissions');
        });
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/resumemission/{id}', 'resumeMission');
        
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/stopmission/{id}', 'stopMission');
        
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/cancelmission/{id}', 'cancelMission');
        
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/closemission/{id}', 'closeMission');
        
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/archivemission/{id}', 'archiveMission');
        
    });
    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::delete('/deletemissionID/{id}', 'deleteMission');
        
    });

    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::put('/updatemissionID/{id}', 'updateMission');
        
    });

    Route::prefix('v1')->controller(MissionController::class)->group(function() {
        Route::post('/createmissions', 'store');
        
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
// Route::prefix('v1')->controller(ClientController::class)->group(function() {
//     Route::post('/insertclients', 'storeMultiple');
    
// });

// Route::middleware(['auth:sanctum', AdminMiddleware::class])
//     ->prefix('v1')
//     ->group(function () {
//         Route::controller(ClientController::class)->group(function () {
//             Route::get('/getclients', 'index');
//             Route::post('/createclient', 'store');
//             Route::put('/updateclientID/{id}', 'updateClient');
//             Route::delete('/deleteclientID/{id}', 'deleteClient');
//             Route::post('/insertclients', 'storeMultiple');
//         });
//     });


    

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
    });

Route::post('/login', action: [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword', [AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email', [AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::prefix('v1')->group(function () { 
    Route::controller(SystemController::class)->group(function () {
        Route::get('/getsystems', 'index');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(SystemController::class)->group(function () {
        Route::post('/createsystem', 'store');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(SystemController::class)->group(function () {
        Route::put('/updatesystemId/{id}', 'updateSystem');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(SystemController::class)->group(function () {
        Route::delete('/deletesystemId/{id}', 'deleteSystem');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(OwnerController::class)->group(function () {
        Route::get('/getowners', 'index');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(OwnerController::class)->group(function () {
        Route::post('/createowner', 'store');
    });
});