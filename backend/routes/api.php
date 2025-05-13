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
use App\Http\Controllers\Api\V1\LayerController;
use App\Http\Controllers\Api\V1\LogController;
use App\Http\Controllers\Api\V1\MissionController;
use App\Http\Controllers\Api\V1\SourceController;
use App\Http\Controllers\Api\V1\StatusController;
use App\Http\Controllers\Api\V1\TypeController;
use App\Models\Layer;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/


Route::prefix('v1')->group(function () { 
    Route::controller(LayerController::class)->group(function () {
        Route::get('/getlayers', 'index');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(LayerController::class)->group(function () {
        Route::post('/createlayer', 'store');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(LayerController::class)->group(function () {
        Route::delete('/deletelayer/{id}', 'deleteLayer');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(SourceController::class)->group(function () {
        Route::get('/getsources', 'index');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(SourceController::class)->group(function () {
        Route::post('/createsource', 'store');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(SourceController::class)->group(function () {
        Route::delete('/deletesource/{id}', 'deleteSource');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(StatusController::class)->group(function () {
        Route::get('/getstatus', 'index');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(StatusController::class)->group(function () {
        Route::post('/createstatus', 'store');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(StatusController::class)->group(function () {
        Route::delete('/deletestatus/{id}', 'deleteStatus');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(TypeController::class)->group(function () {
        Route::get('/getctrltypes', 'index');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(TypeController::class)->group(function () {
        Route::post('/createctrltype', 'store');
    });
});
Route::prefix('v1')->group(function () { 
    Route::controller(TypeController::class)->group(function () {
        Route::delete('/deletetype/{id}', 'deleteType');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(LogController::class)->group(function () {
        Route::get('/logs', 'getUserActivityLogs');
    });
});








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
            Route::put('/closemission/{id}', 'closeMission');
            Route::put('/archivemission/{id}', 'archiveMission');
            Route::put('/cancelmission/{id}', 'cancelMission');
            Route::put('/stopmission/{id}', 'stopMission');
            Route::put('/resumemission/{id}', 'resumeMission');
            Route::get('/archivedmissions', 'getArchivedMissions');
        });
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

       // Route::get('/logs', [LogController::class, 'getUserActivityLogs']);
    });

Route::post('/login', action: [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword', [AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email', [AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);