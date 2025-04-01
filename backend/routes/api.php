<?php

use App\Http\Controllers\Api\V1\ExecutionController;
use App\Http\Middleware\AdminMiddleware;

use App\Http\Middleware\ApiAuthenticate;
use App\Http\Middleware\CheckPasswordReset;
use App\Http\Middleware\ManagerMiddleware;
use App\Http\Middleware\SupervisorMiddleware;
use App\Http\Middleware\TesterMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ControlController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\LayerController;
use App\Http\Controllers\Api\V1\LogController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\MissionController;
use App\Http\Controllers\Api\V1\OwnerController;
use App\Http\Controllers\Api\V1\SystemController;
use App\Http\Controllers\Api\V1\RiskController;
use App\Models\User;

Route::prefix('v1')->controller(UserController::class)->group(function() {
    Route::get('/users', 'index');
        
    });

Route::middleware(['auth:sanctum', AdminMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        // Users
        Route::controller(UserController::class)->group(function () {
          //  Route::get('/users', 'index');
            Route::post('/insert-user', 'store');
            Route::post('/reset-user/{id}', 'resetUser');
            Route::put('/update-user/{id}', 'updateUser');
            Route::patch('/block-user/{id}', 'blockUser');
            Route::patch('/unblock-user/{id}', 'unblockUser');
            Route::delete('/user/{id}', 'deleteUser');
            Route::post('/insert-users', 'storeMultiple');
        });

        // Logs
        Route::get('/logs', [LogController::class, 'getUserActivityLogs']);

        // Controls
        Route::controller(ControlController::class)->group(function () {
            Route::get('/controls', 'index');
            Route::get('/select-options', 'getSelectOptions');

            Route::patch('/update-control/{id}', 'update');
            Route::post('/insert-control', 'store');
            Route::post('/insert-controls', 'multipleStore');
            Route::patch('/archive-control/{id}', 'archiveControl');
            Route::patch('/restore-control/{id}', 'restoreControl');
            Route::delete('/delete-control/{id}', 'deleteControl');
            Route::post('/controls/multiple-delete', 'multipleDelete'); 

        });

        // Risks
        Route::controller(RiskController::class)->group(function () {
            Route::get('/risks', 'index');
            Route::patch('/update-risk/{id}', 'updateRisk');
            Route::delete('/delete-risk/{id}', 'deleteRisk');
            Route::post('/create-risk', 'store'); 
            Route::post('/create-multiple-risks', 'storeMultiple');
            Route::post('/risks/multiple-delete', 'deleteMultipleRisks'); 
 
        });
        
        // Missions
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

        // Clients
        Route::controller(ClientController::class)->group(function () {
            Route::get('/getclients', 'index');
            Route::post('/createclient', 'store');
            Route::put('/updateclientID/{id}', 'updateClient');
            Route::delete('/deleteclientID/{id}', 'deleteClient');
        });
    });




    Route::middleware(['auth:sanctum', ManagerMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        // ExecutionController Routes
        Route::controller(ExecutionController::class)->group(function () {
            Route::post('/missions/{mission}/insert-executions', 'createExecutions');
            Route::get('/missions/{mission}/executions', 'getExecutionsByMission');
        });

        // MissionController Routes
        Route::controller(MissionController::class)->group(function () {
            Route::get('/missions/{mission}/members', 'getMembersByMission');
        });
    });


    Route::middleware(['auth:sanctum', SupervisorMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        //
    });

    Route::middleware(['auth:sanctum', TesterMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        //
    });

Route::post('/login', [AuthController::class, 'login'])->middleware(CheckPasswordReset::class);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/changePassword', [AuthController::class, 'forceUpdatePassword'])->middleware('auth:sanctum');
Route::post('/check-email', [AuthController::class, 'checkEmailExists']);
Route::post('/store-reset-code', [AuthController::class, 'storeResetCode']);
Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::post('/notifications/simulate', [NotificationController::class, 'simulate'])->middleware('auth:sanctum');
Route::get('/notifications', [NotificationController::class, 'index'])->middleware('auth:sanctum');
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->middleware('auth:sanctum');
Route::post('/notifications/{id}/read', [NotificationController::class, 'markNotificationAsRead'])->middleware('auth:sanctum');

// Route::post('/insert-executions', [ExecutionController::class, 'createExecutions'])->middleware(ManagerMiddleware::class,'auth:sanctum');
//Route::get('/missions/{mission}/executions', [ExecutionController::class, 'getExecutionsByMission'])->middleware(ManagerMiddleware::class,'auth:sanctum');
//Route::get('/missions/{mission}/members', [MissionController::class, 'getMembersByMission']);


Route::post('/reset-password', [AuthController::class, 'resetPassword']);





Route::prefix('v1')->group(function () { 
    Route::controller(LayerController::class)->group(function () {
        Route::get('/getlayers', 'index');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(MissionController::class)->group(function () {
        Route::get('/mission/{missionid}/getsystems', 'getSystemsByMissionID');
    });
});

Route::prefix('v1')->group(function () { 
    Route::controller(SystemController::class)->group(function () {
        Route::post('/mission/{missionid}/createsystem', 'storeSystemForMission');
    });
});
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

Route::prefix('v1')->group(function () { 
    Route::controller(MissionController::class)->group(function () {
        Route::get('/getmissions', 'index');
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