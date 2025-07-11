<?php
namespace App\Services\V1;

use App\Models\execution;
use App\Models\Participation;
use App\Repositories\V1\CommentRepository;
use App\Repositories\V1\ExecutionRepository;
use App\Repositories\V1\CntrlRiskCovRepository;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\StatusRepository;
use App\Repositories\V1\StepTestScriptRepository;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class ExecutionService
{
    protected ExecutionRepository $executionRepository;
    protected CntrlRiskCovRepository $covRepository;
    protected EvidenceService $evidenceService;
    protected NotificationService $notificationService;
    protected MissionRepository $missionRepository;
    protected $statusRepository;
    protected $stepRepository;
    protected $commentRepository;


    public function __construct( CommentRepository $commentRepository, EvidenceService $evidenceService, NotificationService $notificationService ,ExecutionRepository $executionRepository, 
    CntrlRiskCovRepository $covRepository , StatusRepository $statusRepository,StepTestScriptRepository $stepRepository,MissionRepository $missionRepository)
    {
    
        $this->statusRepository = $statusRepository;
        $this->stepRepository = $stepRepository;
        $this->executionRepository =$executionRepository;
        $this->notificationService =$notificationService;
        $this->commentRepository =$commentRepository;
        $this->covRepository =$covRepository;
        $this->evidenceService = $evidenceService;
        $this->missionRepository =$missionRepository;
        
    }

    public function getExecutionsByMission($missionId)
    {
        return $this->executionRepository->getExecutionsByMission($missionId);
    }
    // public function getBeganExecutionsByMission($missionId)
    // {
    //     return $this->executionRepository->getBeganExecutionsByMission($missionId);
    // }
    public function getBeganExecutionsByMission($missionId)
{
    $executions = collect($this->executionRepository->getBeganExecutionsByMission($missionId));
    
    $executions->each(function ($execution) {
        $remediations = json_decode($execution->remediations ?? '[]', true);
        $remarks = json_decode($execution->remarks ?? '[]', true);

        $hasRemediations = !empty($remediations);
        $hasRemark = array_filter($remarks, function ($r) {
            return !empty($r['remark_id']);
        });
        $validRemediations = array_filter($remediations, function ($r) {
            return !empty($r['remediation_status_name']);
        });
        $allTerminated = true;
        $hasNonTerminated = false;

        foreach ($validRemediations as $remediation) {
            $status = strtolower($remediation['remediation_status_name'] ?? '');
            if ($status !== 'terminé') {
                $allTerminated = false;
                $hasNonTerminated = true;
            }
        }

        $launchedAt = $execution->execution_launched_at;
        $statusId = $execution->status_id ?? null;
        $isToReview = $execution->execution_is_to_review ?? false;
        $isToValidate = $execution->execution_is_to_validate ?? false;

        // Règles métier combinées
        if (is_null($launchedAt)) {
            $execution->execution_status = 'Non commencé';
        } elseif (!is_null($launchedAt) && is_null($statusId)) {
            $execution->execution_status = 'En cours';
        } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
            $execution->execution_status = 'En cours de remediation';
        } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
            if (!$isToReview && !$isToValidate && !$hasRemark) {
                $execution->execution_status = 'Terminé mais pas soumis';
            } elseif (!$isToReview && !$isToValidate && $hasRemark) {
                $execution->execution_status = 'A corriger';
            } elseif ($isToReview && !$isToValidate) {
                $execution->execution_status = 'En cours de revue';
            } elseif (!$isToReview && $isToValidate) {
                $execution->execution_status = 'En cours de validation';
            } elseif ($isToReview && $isToValidate) {
                $execution->execution_status = 'Terminé et validé';
            }
        } else {
            $execution->execution_status = 'statut inconnu';
        }
    });

    return $executions;
}
    public function getUnbeganExecutionsByMission($missionId)
    {
       // return $this->executionRepository->getUnbeganExecutionsByMission($missionId);
        $executions = collect($this->executionRepository->getUnbeganExecutionsByMission($missionId));
    
        $executions->each(function ($execution) {
            $execution->execution_status = 'Non commencé';
        });
    
        return $executions;
    }
    public function createComment($data){
        return $this->commentRepository->createComment($data);

    }
    public function updateComment($id, $text)
{
    return $this->commentRepository->updateComment($id, ['text' => $text]);
}

public function deleteComment($id)
{
    return $this->commentRepository->deleteComment($id);
}

public function getExecutionById($executionId)
{
    return $this->executionRepository->getExecutionById($executionId);
}
// public function geteffectiveExecutionsByMission($missionId)
// {
//     return $this->executionRepository->getEffectiveExecutionsByMission($missionId);
// }

// public function getIneffectiveExecutionsByMission($missionId)
// {
//     return $this->executionRepository->getIneffectiveExecutionsByMission($missionId);
// }
public function geteffectiveExecutionsByMission($missionId)
 {
    
     $executions = collect($this->executionRepository->getEffectiveExecutionsByMission($missionId));
    
     $executions->each(function ($execution) {
         $remediations = json_decode($execution->remediations ?? '[]', true);
         $remarks = json_decode($execution->remarks ?? '[]', true);
 
         $hasRemediations = !empty($remediations);
         $hasRemark = array_filter($remarks, function ($r) {
             return !empty($r['remark_id']);
         });
         $validRemediations = array_filter($remediations, function ($r) {
             return !empty($r['remediation_status_name']);
         });
         $allTerminated = true;
         $hasNonTerminated = false;
 
         foreach ($validRemediations as $remediation) {
             $status = strtolower($remediation['remediation_status_name'] ?? '');
             if ($status !== 'terminé') {
                 $allTerminated = false;
                 $hasNonTerminated = true;
             }
         }
 
         $launchedAt = $execution->execution_launched_at;
         $statusId = $execution->status_id ?? null;
         $isToReview = $execution->execution_is_to_review ?? false;
         $isToValidate = $execution->execution_is_to_validate ?? false;
 
         // Règles métier combinées
         if (is_null($launchedAt)) {
             $execution->execution_status = 'Non commencé';
         } elseif (!is_null($launchedAt) && is_null($statusId)) {
             $execution->execution_status = 'En cours';
         } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
             $execution->execution_status = 'En cours de remediation';
         } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
             if (!$isToReview && !$isToValidate && !$hasRemark) {
                 $execution->execution_status = 'Terminé mais pas soumis';
             } elseif (!$isToReview && !$isToValidate && $hasRemark) {
                 $execution->execution_status = 'A corriger';
             } elseif ($isToReview && !$isToValidate) {
                 $execution->execution_status = 'En cours de revue';
             } elseif (!$isToReview && $isToValidate) {
                 $execution->execution_status = 'En cours de validation';
             } elseif ($isToReview && $isToValidate) {
                 $execution->execution_status = 'Terminé et validé';
             }
         } else {
             $execution->execution_status = 'statut inconnu';
         }
     });
 
     return $executions;
 }
public function getIneffectiveExecutionsByMission($missionId)
{
    $executions = collect($this->executionRepository->getIneffectiveExecutionsByMission($missionId));
    
    $executions->each(function ($execution) {
        $remediations = json_decode($execution->remediations ?? '[]', true);
        $remarks = json_decode($execution->remarks ?? '[]', true);

        $hasRemediations = !empty($remediations);
        $hasRemark = array_filter($remarks, function ($r) {
            return !empty($r['remark_id']);
        });
        $validRemediations = array_filter($remediations, function ($r) {
            return !empty($r['remediation_status_name']);
        });
        $allTerminated = true;
        $hasNonTerminated = false;

        foreach ($validRemediations as $remediation) {
            $status = strtolower($remediation['remediation_status_name'] ?? '');
            if ($status !== 'terminé') {
                $allTerminated = false;
                $hasNonTerminated = true;
            }
        }

        $launchedAt = $execution->execution_launched_at;
        $statusId = $execution->status_id ?? null;
        $isToReview = $execution->execution_is_to_review ?? false;
        $isToValidate = $execution->execution_is_to_validate ?? false;

        // Règles métier combinées
        if (is_null($launchedAt)) {
            $execution->execution_status = 'Non commencé';
        } elseif (!is_null($launchedAt) && is_null($statusId)) {
            $execution->execution_status = 'En cours';
        } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
            $execution->execution_status = 'En cours de remediation';
        } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
            if (!$isToReview && !$isToValidate && !$hasRemark) {
                $execution->execution_status = 'Terminé mais pas soumis';
            } elseif (!$isToReview && !$isToValidate && $hasRemark) {
                $execution->execution_status = 'A corriger';
            } elseif ($isToReview && !$isToValidate) {
                $execution->execution_status = 'En cours de revue';
            } elseif (!$isToReview && $isToValidate) {
                $execution->execution_status = 'En cours de validation';
            } elseif ($isToReview && $isToValidate) {
                $execution->execution_status = 'Terminé et validé';
            }
        } else {
            $execution->execution_status = 'statut inconnu';
        }
    });

    return $executions;
}
public function submitExecutionForReview($missionId,$executionId)
{
    $missionName =$this->missionRepository->findMissionById($missionId);
    $result=$this->executionRepository->updateExecutionStatus($executionId,true,false);
    if($result){
        
        $supervisorsIds = Participation::where('mission_id', $missionId)
        ->whereHas('profile', function ($query) {
            $query->where('profile_name', 'superviseur');
        })
        ->pluck('user_id');
    
    foreach ($supervisorsIds as $userId) {
        $this->notificationService->sendNotification(
            $userId, 
            "Vous avez des contrôles à revoir pour une mission $missionName->mission_name ",
            ['type' => 'review_cntrl', 'id' => $executionId,'missionId'=>$missionId],
            "review_cntrl"
        );
    }
    
    }
    return $result;
}
public function submitExecutionForValidation($missionId, $executionId)
{
    $missionName =$this->missionRepository->findMissionById($missionId);
    $result=$this->executionRepository->updateExecutionStatus($executionId, false, true);

    $supervisorsIds = Participation::where('mission_id', $missionId)
        ->whereHas('profile', function ($query) {
            $query->where('profile_name', 'manager');
        })
        ->pluck('user_id');

    foreach ($supervisorsIds as $userId) {
        $this->notificationService->sendNotification(
            $userId,
            "Vous avez des contrôles à revoir pour une mission $missionName->mission_name",
            ['type' => 'validation_cntrl', 'id' => $executionId,'missionId'=>$missionId],
            "review_cntrl"
        );
    }

    return $result; 
}

public function submitExecutionForCorrection($missionId,$systemId,$executionId)
{
    $missionName =$this->missionRepository->findMissionById($missionId);
    $result= $this->executionRepository->updateExecutionStatus($executionId,false,false);
    
    $testeurId = Execution::where('id', $executionId)->value('user_id');
   
        $this->notificationService->sendNotification(
            $testeurId,
            "Vous avez des contrôles à corifer pour une mission $missionName->mission_name",
            ['type' => 'correction_cntrl', 'id' => $executionId,'missionId'=>$missionId,'systemId'=>$systemId],
            "correction_cntrl"
        );
    
        return $result; 
}
public function submitExecutionForFinalValidation($executionId)
{
    return $this->executionRepository->updateExecutionStatus($executionId,true,true);
}
    public function getExecutionStatusOptions()
    {
        return $this->statusRepository->getExecutionStatusOptions();
    }
    public function getExecutionsByApp($appId)
    {
        return $this->executionRepository->getExecutionsByApp($appId);
    }
    // public function getAllExecutionsByApp($appId)
    // {
    //     return $this->executionRepository->getAllExecutionsByApp($appId);

    // }

    public function getAllExecutionsByApp($appId)
    {
        $executions = collect($this->executionRepository->getAllExecutionsByApp($appId));
    
        $executions->each(function ($execution) {
            $remediations = json_decode($execution->remediations ?? '[]', true);
            $remarks = json_decode($execution->remarks ?? '[]', true);

            $hasRemediations = !empty($remediations);
            $hasRemark=array_filter($remarks, function ($r) {
                return !empty($r['remark_id']); // ou ajouter plus de critères si besoin
            });
            $validRemediations = array_filter($remediations, function ($r) {
                return !empty($r['remediation_status_name']); // ou ajouter plus de critères si besoin
            });
            $allTerminated = true;
            $hasNonTerminated = false;
    
            foreach ($validRemediations as $remediation) {
                $status = strtolower($remediation['remediation_status_name'] ?? '');
                if ($status !== 'terminé') {
                    $allTerminated = false;
                    $hasNonTerminated = true;
                }
            }
    
            $launchedAt = $execution->execution_launched_at;
            $statusId = $execution->status_id ?? null;
            $isToReview = $execution->execution_is_to_review ?? false;
            $isToValidate = $execution->execution_is_to_validate ?? false;
    
            // Règles métier combinées
            if (is_null($launchedAt)) {
                $execution->execution_status = 'Non commencé';
            } elseif (!is_null($launchedAt)  && is_null($statusId)) {
                $execution->execution_status = 'En cours';
            } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
                $execution->execution_status = 'En cours de remediation';
                        
            } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
                if (!$isToReview && !$isToValidate && !$hasRemark) {
                    $execution->execution_status = 'Terminé mais pas soumis';
                } elseif(!$isToReview && !$isToValidate && $hasRemark){
                    $execution->execution_status = 'A coriger';
                }
                elseif ($isToReview && !$isToValidate) {
                    $execution->execution_status = 'En cours de revue';
                }  elseif (!$isToReview && $isToValidate) {
                    $execution->execution_status = 'En cours de validation';
                } elseif ($isToReview && $isToValidate) {
                    $execution->execution_status = 'Terminé et validé';
                }
            } else {
                // Fallback général si aucune règle n'est remplie
                $execution->execution_status = 'statut inconnu';
            }
        });
    
        return $executions;
    }
    


    public function getExecutionsByMissionAndTester($missionId,$userId)
    {
        return $this->executionRepository->getExecutionsByMissionAndTester($missionId,$userId);
    }

    public function getExecutionsByMissionAndSystemAndTester($missionId,$userId,$appId)
    {
       // return $this->executionRepository->getExecutionsByMissionAndSystemAndTester($missionId,$userId,$appId);
        $executions = collect($this->executionRepository->getExecutionsByMissionAndSystemAndTester($missionId,$userId,$appId));
    
        $executions->each(function ($execution) {
            $remediations = json_decode($execution->remediations ?? '[]', true);
            $remarks = json_decode($execution->remarks ?? '[]', true);
            $hasRemediations = !empty($remediations);
            $hasRemark=array_filter($remarks, function ($r) {
                return !empty($r['remark_id']); // ou ajouter plus de critères si besoin
            });
            $validRemediations = array_filter($remediations, function ($r) {
                return !empty($r['remediation_status_name']); // ou ajouter plus de critères si besoin
            });
            $allTerminated = true;
            $hasNonTerminated = false;
    
            foreach ($validRemediations as $remediation) {
                $status = strtolower($remediation['remediation_status_name'] ?? '');
                if ($status !== 'terminé') {
                    $allTerminated = false;
                    $hasNonTerminated = true;
                }
            }
    
            $launchedAt = $execution->execution_launched_at;
            $statusId = $execution->status_id ?? null;
            $isToReview = $execution->execution_is_to_review ?? false;
            $isToValidate = $execution->execution_is_to_validate ?? false;
    
            // Règles métier combinées
            if (is_null($launchedAt)) {
                $execution->execution_status = 'Non commencé';
            } elseif (!is_null($launchedAt)  && is_null($statusId)) {
                $execution->execution_status = 'En cours';
            } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
                $execution->execution_status = 'En cours de remediation';
                        
            } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
                if (!$isToReview && !$isToValidate && !$hasRemark) {
                    $execution->execution_status = 'Terminé mais pas soumis';
                } elseif(!$isToReview && !$isToValidate && $hasRemark){
                    $execution->execution_status = 'A coriger';
                }
                elseif ($isToReview && $isToValidate) {
                    $execution->execution_status = 'Terminé et validé';
                }
                elseif (!$isToValidate && $isToReview ) {
                    $execution->execution_status = 'En cours de revue';
                }  elseif (!$isToReview && $isToValidate) {
                    $execution->execution_status = 'En cours de validation';
                } 
            } else {
                // Fallback général si aucune règle n'est remplie
                $execution->execution_status = 'statut inconnu';
            }
        });
    
        return $executions;
    }
    public function getExecutionsByMissionAndSystemAndTesterFiltered($missionId,$userId,$appId)
    {
       // return $this->executionRepository->getExecutionsByMissionAndSystemAndTesterFiltered($missionId,$userId,$appId);
        $executions = collect($this->executionRepository->getExecutionsByMissionAndSystemAndTesterFiltered($missionId,$userId,$appId));
    
        $executions->each(function ($execution) {
            $remediations = json_decode($execution->remediations ?? '[]', true);
            $remarks = json_decode($execution->remarks ?? '[]', true);
            $hasRemediations = !empty($remediations);
            $hasRemark=array_filter($remarks, function ($r) {
                return !empty($r['remark_id']); // ou ajouter plus de critères si besoin
            });
            $validRemediations = array_filter($remediations, function ($r) {
                return !empty($r['remediation_status_name']); // ou ajouter plus de critères si besoin
            });
            $allTerminated = true;
            $hasNonTerminated = false;
    
            foreach ($validRemediations as $remediation) {
                $status = strtolower($remediation['remediation_status_name'] ?? '');
                if ($status !== 'terminé') {
                    $allTerminated = false;
                    $hasNonTerminated = true;
                }
            }
    
            $launchedAt = $execution->execution_launched_at;
            $statusId = $execution->status_id ?? null;
            $isToReview = $execution->execution_is_to_review ?? false;
            $isToValidate = $execution->execution_is_to_validate ?? false;
    
            // Règles métier combinées
            if (is_null($launchedAt)) {
                $execution->execution_status = 'Non commencé';
            } elseif (!is_null($launchedAt)  && is_null($statusId)) {
                $execution->execution_status = 'En cours';
            } elseif (!is_null($launchedAt) && !empty($validRemediations) && $hasNonTerminated && !is_null($statusId)) {
                $execution->execution_status = 'En cours de remediation';
                        
            } elseif (!is_null($launchedAt) && $hasRemediations && $allTerminated && !is_null($statusId)) {
                if (!$isToReview && !$isToValidate && !$hasRemark) {
                    $execution->execution_status = 'Terminé mais pas soumis';
                } elseif(!$isToReview && !$isToValidate && $hasRemark){
                    $execution->execution_status = 'A coriger';
                }
                elseif ($isToReview && !$isToValidate) {
                    $execution->execution_status = 'En cours de revue';
                }  elseif (!$isToReview && $isToValidate) {
                    $execution->execution_status = 'En cours de validation';
                } elseif ($isToReview && $isToValidate) {
                    $execution->execution_status = 'Terminé et validé';
                }
            } else {
                // Fallback général si aucune règle n'est remplie
                $execution->execution_status = 'statut inconnu';
            }
        });
    
        return $executions;
    }


    // public function createExecutions(array $data): Execution
    // {
    //     DB::beginTransaction(); // Démarrer la transaction

    //     try {
    //         $lastExecution = null; // Pour retourner la dernière exécution insérée

    //         foreach ($data['executions'] as $execution) {
    //             $executionToInsert = [];
    //             $coverageToInsert = [];

    //             $executionToInsert['controlDescription'] = $execution['controlModified'] ? $execution['controlDescription'] : null;

    //             $executionToInsert['controlId'] = $execution['controlId'];
    //             $executionToInsert['controlTester'] = $execution['controlTester'];
    //             $executionToInsert['controlOwner'] = $execution['controlOwner'];
    //             $executionToInsert['layerId'] = $execution['layerId'];

    //             $lastExecution = $this->executionRepository->createExecution($executionToInsert);

                
    //             if (!$lastExecution) {
    //                 throw new \Exception("Failed to create execution");
    //             };
    //             if ($executionToInsert['controlTester']) {

    //                 $this->notificationService->sendNotification(
    //                     $executionToInsert['controlTester'],
    //                     "Vous avez été assigné(e) à des contrôles pour la mission {$execution['missionName']}.",
    //                     ['type' => 'affectation_cntrl', 'id' => '#'],
    //                     "affectation_cntrl"
    //                 );
    //              };
    //             $coverageToInsert['riskDescription'] = $execution['riskModified'] ? $execution['riskDescription'] : null;


    //             $coverageToInsert['riskId'] = $execution['riskId'];
    //             $coverageToInsert['execution_id'] = $lastExecution->id;
    //             $coverageToInsert['riskOwner'] = $execution['riskOwner'];

    //             Log::info('Coverage Data:', $coverageToInsert);

    //             $this->covRepository->createCoverage($coverageToInsert);
    //         }

    //         DB::commit(); 
    //         return $lastExecution; 

    //     } catch (\Exception $e) {
    //         DB::rollBack(); 
    //         Log::error("Error creating executions", ['error' => $e->getMessage()]);
    //         throw new \Exception("Error while creating executions");
    //     }
    // }

    public function createExecutions(array $data): Execution
    {
        DB::beginTransaction(); // Démarrer la transaction

        try {
            $lastExecution = null; // Pour retourner la dernière exécution insérée
            foreach ($data['executions'] as $execution) {
                $executionToInsert = [];
                $coverageToInsert = [];

                $executionToInsert['controlDescription'] = $execution['controlModified'] ? $execution['controlDescription'] : null;

                $executionToInsert['controlId'] = $execution['controlId'];
                $executionToInsert['controlTester'] = $execution['controlTester'];
                $executionToInsert['controlOwner'] = $execution['controlOwner'];
                $executionToInsert['layerId'] = $execution['layerId'];

                $lastExecution = $this->executionRepository->createExecution($executionToInsert);

                
                if (!$lastExecution) {
                    throw new \Exception("Failed to create execution");
                };
                if ($executionToInsert['controlTester']) {
                    Log::info("Appel getSystemIdByExecutionIdAndMissionIdAndLayerId", [
                        'layerId' => $execution['layerId'],
                        'executionId' => $lastExecution->id
                    ]);
                    $system =$this->executionRepository->getsystemIdByExecutionIdAndMissionIdAndLayerId( $execution['layerId'], $lastExecution->id);
                  
                    
                    if ($system) {
                        $systemId = $system->system_id;
                        $missionId = $system->mission_id;
                        $missionName = $system->mission_name;
                    } else {
                        $systemId = null;
                        $missionId = null;

                    }
                    
                    
                    
                    $this->notificationService->sendNotification(
                        $executionToInsert['controlTester'],
                        "Vous avez été assigné(e) à des contrôles pour la mission  $missionName ",
                        ['type' => 'affectation_cntrl', 'id' => $missionId,'systemId'=>$systemId],
                        "affectation_cntrl"
                    );
                 };
                $coverageToInsert['riskDescription'] = $execution['riskModified'] ? $execution['riskDescription'] : null;


                $coverageToInsert['riskId'] = $execution['riskId'];
                $coverageToInsert['execution_id'] = $lastExecution->id;
                $coverageToInsert['riskOwner'] = $execution['riskOwner'];

                Log::info('Coverage Data:', $coverageToInsert);

                $this->covRepository->createCoverage($coverageToInsert);
            }

            DB::commit(); 
            return $lastExecution; 

        } catch (\Exception $e) {
            DB::rollBack(); 
            Log::error("Error creating executions", ['error' => $e->getMessage()]);
            throw new \Exception("Error while creating executions");
        }
    }

  

    public function deleteExecutions($executionsIds){
        return $this->executionRepository->deleteExecutions($executionsIds);

    }  

public function updateExecution($executionId, $data)
{
    $executionData = [
        'id' => $executionId,
        'cntrl_modification' => $data['controlModification'] ?? null,
        'control_owner'=> $data['controlOwner'] ?? null,
        'ipe' => $data['ipe'] ?? null,
        'design' => $data['design'] ?? null,
        'effectiveness' => $data['effectiveness'] ?? null,
        'status_id' => $data['status_id'] ?? null,
        'comment' => $data['comment']   ?? null,
        'user_id' => $data['controlTester'] ?? null,
    ];
    $riskData = [

        'risk_modification' => $data['riskModification'] ?? null,
        'risk_owner' => $data['riskOwner'] ?? null,
    ];
    $riskFilteredData = array_filter($riskData, function ($value) {
        return !is_null($value);
    });
    if ($executionData['user_id']) {

        $this->notificationService->sendNotification(
            $executionData['user_id'],
            "Vous avez été assigné(e) à des contrôles pour la mission {$data['missionName']}.",
            ['type' => 'affectation_cntrl', 'id' => '#'],
            "affectation_cntrl"
        );
     };
    if(!empty($data['steps'])) {
        Log::info('Steps Data:', $data['steps']);
       foreach ($data['steps'] as $step) {
            $stepData = [
               
                'checked' => $step['step_checked'],
                'comment' => $step['step_comment'] ?? null,
            ];
            Log::info('Step Data:', $stepData);
            $this->stepRepository->update($stepData, $step['step_execution_id']);

        }
    }

    if (!empty($data['covId'])&&!empty($riskFilteredData)) {
       $this->covRepository->updateCoverage($data['covId'], $riskFilteredData);
    }

    $filteredData = array_filter($executionData, function ($value) {
        return !is_null($value);
    });

    // Mise à jour de l'exécution
     $this->executionRepository->updateExecution($executionId, $filteredData);
     $execution = execution::with('status')->find($executionId);
     return  $execution;

   
}

public function updateMultipleExecutions(array $executionsData)
{
    DB::beginTransaction();

    try {
        foreach ($executionsData as $executionData) {
            // Assure-toi que chaque élément a un ID d'exécution
            if (!isset($executionData['id'])) {
                throw new \Exception("Execution ID is required for update.");
            }

            $this->updateExecution($executionData['id'], $executionData);
        }

        DB::commit();
        return true;

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("Error updating multiple executions", ['error' => $e->getMessage()]);
        throw new \Exception("Error while updating executions");
    }
}


public function launchExecution($missionId,$executionId)
{
    $raw=[
        'launched_at' => now(),
    ];
    return $this->executionRepository->updateAnExecutionRaw($executionId , $raw);
}

public function getexecutionReviewBySuperviseur($missionId)
{
    return $this->executionRepository->getexecutionReviewBySuperviseur($missionId);
}
public function getAllExecutionReview($missionId)
{
    return $this->executionRepository->getAllExecutionReview($missionId);
}
public function getAllExecutionReviewAdmin($missionId,$appId)
{
    return $this->executionRepository->getAllExecutionReviewAdmin($missionId,$appId);
}
public function getmissionReviewBySuperviseur($userId)
{
   // return $this->executionRepository->getmissionReviewBySuperviseur($userId);
   $missions= $this->executionRepository->getmissionReviewBySuperviseur($userId);
   return $missions->map(function ($mission) use ($userId) {
       // Trouver la participation de l'utilisateur courant
       $userParticipation = $mission->participations->firstWhere('user_id', $userId);
       $user = $userParticipation->user;
       $profile_name=$userParticipation->profile;
       
       return [
           'id' => $mission->id,
           'missionName' => $mission->mission_name,
           'clientId' => $mission->client_id,
           'clientName' => $mission->client->commercial_name,
           'startDate' => $mission->start_date,
           'endDate' => $mission->end_date,
           'auditStartDate' => $mission->audit_start_date,
           'auditEndDate' => $mission->audit_end_date,
           'statusId' => $mission->status_id,
           'status' => $mission->status->status_name,
           'profileName' => $profile_name->profile_name,

           'userId' => $user->id,
           'userFullName' => $user->first_name . ' ' . $user->last_name,
           'userRole' => $user->role == 1 ? 'admin' : 'user',
       ];

})->toArray();
}

public function getexecutionReviewByManager($missionId)
{
    return $this->executionRepository->getexecutionReviewByManager($missionId);
}
// public function getmissionReviewManager($userId)
// {
//     return $this->executionRepository->getmissionReviewManager($userId);
// }

public function getmissionReviewManager($userId)
{
    $missions= $this->executionRepository->getmissionReviewManager($userId);
    return $missions->map(function ($mission) use ($userId) {
        // Trouver la participation de l'utilisateur courant
        $userParticipation = $mission->participations->firstWhere('user_id', $userId);
        $user = $userParticipation->user;
        $profile_name=$userParticipation->profile;
        
        return [
            'id' => $mission->id,
            'missionName' => $mission->mission_name,
            'clientId' => $mission->client_id,
            'clientName' => $mission->client->commercial_name,
            'startDate' => $mission->start_date,
            'endDate' => $mission->end_date,
            'auditStartDate' => $mission->audit_start_date,
            'auditEndDate' => $mission->audit_end_date,
            'statusId' => $mission->status_id,
            'status' => $mission->status->status_name,
            'profileName' => $profile_name->profile_name,

            'userId' => $user->id,
            'userFullName' => $user->first_name . ' ' . $user->last_name,
            'userRole' => $user->role == 1 ? 'admin' : 'user',
        ];

})->toArray();
}
}
