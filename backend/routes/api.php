<?php

use App\Http\Controllers\Api\V1\EvidenceController;
use App\Http\Controllers\Api\V1\ExecutionController;
use App\Http\Controllers\Api\V1\ParticipationController;
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
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RemediationController;
use App\Http\Controllers\Api\V1\SystemController;
use App\Http\Controllers\Api\V1\RiskController;
use App\Models\Profile;
use App\Models\User;

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

        Route::controller(AuthController::class)->group(function () {
            Route::post('/reset-user', 'resetUser');
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
            //  Route::get('/getmissions/myMissions', 'getUserMissions');
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


Route::middleware(['auth:sanctum', AdminMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/users', 'index');
            Route::get('/grades', 'getGrades');
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
            Route::get('/missions/{mission}/workplanOptions', 'getWorkplanOptionsByMission');
            Route::post('/executions/deleteExecutions', 'deleteExecutions');
            Route::post('/executions/update-executions', 'updateMultipleExecutions');
        });

        Route::controller(ParticipationController::class)->group(function () {

            Route::get('/missions/{mission}/testers', 'getTestersByMissionID');
        });

        //MissionController Routes
        Route::controller(MissionController::class)->group(function () {
            Route::get('/missions/{mission}/report', 'getMissionReport');
            Route::get('/missions/systems/{app}/system-report', 'getSystemReport');

        });
    });
    Route::get('/missions/{mission}/report', [MissionController::class,'getMissionReport']);
    Route::get('/missions/systems/{app}/system-report', [MissionController::class,'getSystemReport']);

//  Route::controller(ParticipationController::class)->group(function () {
//     Route::get('/missions/{mission}/testers', 'getTestersByMissionID');
// });

Route::middleware(['auth:sanctum', SupervisorMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        Route::controller(ExecutionController::class)->group(function () {

            Route::post('missions/{mission}/executions/create-comment', 'createComment');
            Route::put('missions/{mission}/executions/update-comment/{id}', 'updateComment');     
            Route::delete('missions/{mission}/executions/delete-comment/{id}', 'deleteComment');  
      
        });
        

    });

Route::middleware(['auth:sanctum', TesterMiddleware::class])
    ->prefix('v1')
    ->group(function () {
        Route::controller(ExecutionController::class)->group(function () {
            Route::get('/missions/{mission}/executions-for-tester', 'getExecutionsByMissionAndTester');
            Route::put('missions/{mission}/executions/update-execution/{execution}', 'updateExecution');
            Route::put('/executions/launch-execution/{execution}', 'launchExecution');
          //  Route::get('/executions/get-options', 'getExecutionStatusOptions');

            Route::get('missions/{mission}/executions/get-execution/{execution}', 'getExecutionById');//correct one
            Route::patch('/executions/submit-execution-for-review/{executionID}', 'submitExecutionForReview');
            Route::patch('/executions/submit-execution-for-validation/{executionID}', 'submitExecutionForValidation');


        });
        Route::controller(EvidenceController::class)->group(function () {
            Route::delete('missions/{mission}/evidences/delete-evidence/{evidenceId}', 'destroy');
            Route::post('missions/{mission}/evidences/upload', 'storeMultiple');
        });
    });

//Route::post('/evidences/upload', [ExecutionController::class,'storeFile']);

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
Route::get('/missions/{mission}/executions', [ExecutionController::class, 'getExecutionsByMission']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);





/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

Route::prefix('v1')->controller(UserController::class)->group(function () {
    Route::get('/users', 'index');
});
//recuperer profils
Route::prefix('v1')->controller(ProfileController::class)->group(function () {
    Route::get('/getprofils', 'index');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::get('/getmissions/user', 'getUserMissions')->middleware('auth:sanctum');
});

//gestion membre de la mission
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::get('/missions/{missionid}/members', 'getMembersByMission');
});
Route::prefix('v1')->controller(ParticipationController::class)->group(function () {
    Route::post('/missions/{missionid}/createmembers', 'store');
});
Route::prefix('v1')->controller(ParticipationController::class)->group(function () {
    Route::delete('/deletemember/{id}', 'deleteParticipant');
});

//gestion scope controle
Route::prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/missions/{missionId}/getmatrix', 'getExecutionsByMission');
    });
});
Route::prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/missions/{appId}/getexecutionsList', 'getExecutionsByApp');
    });
});

Route::prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/missions/{appId}/getAllexecutionsList', 'getAllExecutionsByApp');
    });
});
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/missions/{missionId}/{appId}/getexecutionsListForTesteur', 'getExecutionsByMissionAndSystemAndTester');
    });
});
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/missions/{missionId}/{appId}/getexecutionsListForTesteurForCorrection', 'getExecutionsByMissionAndSystemAndTesterFiltered');
    });
});



Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(MissionController::class)->group(function () {
        Route::get('/mission/{missionid}/getsystems', 'getSystemsByMissionID');
    });

    Route::controller(MissionController::class)->group(function () {
        Route::put('/missions/{id}/requestcancelmission', 'RequestCancelMission');
    });
    Route::controller(MissionController::class)->group(function () {
        Route::put('/missions/{id}/requestCloseMission', 'RequestCloseMission');
    });
    Route::controller(MissionController::class)->group(function () {
        Route::put('/missions/{id}/requestArchiveMission', 'RequestArchiveMission');
    });
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/acceptrequeststatus/{id}', 'AcceptRequestStatus');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::get('/missions/getrequeststatusmission', 'getRequestStatusForMissions');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/refuseRequestStatus/{id}', 'RefuseRequestStatus');
});
//gestion layers
Route::prefix('v1')->group(function () {
    Route::controller(LayerController::class)->group(function () {
        Route::get('/getlayers', 'index');
    });
});
//gestion owners
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
//gestion systems
// Route::prefix('v1')->group(function () {
//     Route::controller(MissionController::class)->group(function () {
//         Route::get('/mission/{missionid}/getsystems', 'getSystemsByMissionID');
//     });
// });
Route::prefix('v1')->group(function () {
    Route::controller(SystemController::class)->group(function () {
        Route::post('/mission/{missionid}/createsystem', 'storeSystemForMission');
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

Route::prefix('v1')->controller(SystemController::class)->group(function () {
    Route::get('/systems/{systemId}', 'getsystemInfo');
});

// Route::prefix('v1')->group(function () {
//     Route::controller(SystemController::class)->group(function () {
//         Route::get('/getsystems', 'index');
//     });
// });
// Route::prefix('v1')->group(function () {
//     Route::controller(SystemController::class)->group(function () {
//         Route::post('/createsystem', 'store');
//     });
// });

//gestion mission 

Route::prefix('v1')->group(function () {
    Route::controller(MissionController::class)->group(function () {
        Route::get('/getmissions', 'index');
    });
});

Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/resumemission/{id}', 'resumeMission');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/stopmission/{id}', 'stopMission');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/missions/{id}/cancelmission', 'cancelMission');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/closemission/{id}', 'closeMission');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/archivemission/{id}', 'archiveMission');
});
Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::delete('/deletemissionID/{id}', 'deleteMission');
});

Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::put('/updatemissionID/{id}', 'updateMission');
});

Route::prefix('v1')->controller(MissionController::class)->group(function () {
    Route::post('/createmissions', 'store');
});

//gestion client 
Route::prefix('v1')->controller(ClientController::class)->group(function () {
    Route::post('/createclient', 'store');
});
Route::prefix('v1')->controller(ClientController::class)->group(function () {
    Route::get('/getclients', 'index');
});

Route::prefix('v1')->controller(ClientController::class)->group(function () {
    Route::delete('/deleteclientID/{id}', 'deleteClient');
});
Route::prefix('v1')->controller(ClientController::class)->group(function () {
    Route::put('/updateclientID/{id}', 'updateClient');
});


//gestion remediation 
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::post('/execution/{executionid}/{controlCode}/createremediation', 'storeRemediationForExecution');
});

Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::get('/execution/{executionid}/getremediations', 'getAllRemediationsByExecution');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::put('/execution/updateRemediation/{remediationId}', 'updateRemediation');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::delete('/execution/deleteRemediation/{remediationId}', 'deleteRemediation');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::get('/execution/getRemediation/{remediationId}', 'getRemediationInfo');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::get('/remediation/get-options', 'getRemediationStatusOptions');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::put('/closeremediation/{id}', 'closeRemediation');
});
Route::prefix('v1')->controller(RemediationController::class)->group(function () {
    Route::put('/updatestatusremediation/{id}', 'UpdateStatusRemediation');
});
Route::prefix('v1')->controller(EvidenceController::class)->group(function () {
    Route::delete('/remediationevidences/delete-evidence/{evidenceId}', 'destroyRemediation');
});
Route::prefix('v1')->controller(EvidenceController::class)->group(function () {
    Route::post('/remediationevidences/upload', 'storeRemediationMultiple');
});
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/revue/{missionId}/getexecutionreviewedforSuperviseur', 'getexecutionReviewBySuperviseur');
    });
});
// Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
//     Route::get('/revue/getmissionexecutionreviewedforSuperviseur', 'getmissionReviewBySuperviseur');
// });

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/revue/getmissionexecutionreviewedforSuperviseur', 'getmissionReviewBySuperviseur');
    });
});
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
Route::controller(ExecutionController::class)->group(function () {
    Route::get('/revue/{missionId}/getexecutionreviewedforManager', 'getexecutionReviewByManager');
});
});
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::controller(ExecutionController::class)->group(function () {
        Route::get('/revue/getmissionexecutionreviewedforManager', 'getmissionReviewManager');
    });
});
// Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
//     Route::get('/revue/getmissionexecutionreviewedforManager', 'getmissionReviewManager');
// });

Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::patch('/executions/submit-execution-for-review/{executionID}', 'submitExecutionForReview');
});
Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::patch('/executions/submit-execution-for-validation/{executionID}', 'submitExecutionForValidation');
});
Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::patch('/executions/submit-execution-for-correction/{executionID}', 'submitExecutionForCorrection');
});

Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::patch('/executions/submit-execution-for-final-validation/{executionID}', 'submitExecutionForFinalValidation');
});

Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::get('/executions/get-execution/{execution}', 'getExecutionById');
});
Route::prefix('v1')->controller(ExecutionController::class)->group(function () {
    Route::get('/executions/get-options', 'getExecutionStatusOptions');
});


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



// Route::put('executions/update-execution/{execution}', [ExecutionController::class, 'updateExecution']);
// Route::put('executions/launch-execution/{execution}', [ExecutionController::class, 'launchExecution']);
