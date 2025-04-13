<?php
namespace App\Services\V1;

use App\Models\execution;
use App\Repositories\V1\ExecutionRepository;
use App\Repositories\V1\CntrlRiskCovRepository;
use App\Repositories\V1\StatusRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class ExecutionService
{
    protected ExecutionRepository $executionRepository;
    protected CntrlRiskCovRepository $covRepository;
    protected EvidenceService $evidenceService;
    protected $statusRepository;


    public function __construct( EvidenceService $evidenceService,ExecutionRepository $executionRepository, 
    CntrlRiskCovRepository $covRepository , StatusRepository $statusRepository)
    {
    
        $this->statusRepository = $statusRepository;

        $this->executionRepository =$executionRepository;
        $this->covRepository =$covRepository;
        $this->evidenceService = $evidenceService;
        
    }

    public function getExecutionsByMission($missionId)
    {
        return $this->executionRepository->getExecutionsByMission($missionId);
    }

    public function getExecutionById($executionId)
{
    return $this->executionRepository->getExecutionById($executionId);
}
    public function getExecutionStatusOptions()
    {
        return $this->statusRepository->getExecutionStatusOptions();
    }
    public function getExecutionsByApp($appId)
    {
        return $this->executionRepository->getExecutionsByApp($appId);
    }

    public function getExecutionsByMissionAndTester($missionId,$userId)
    {
        return $this->executionRepository->getExecutionsByMissionAndTester($missionId,$userId);
    }

    public function getExecutionsByMissionAndSystemAndTester($missionId,$userId,$appId)
    {
        return $this->executionRepository->getExecutionsByMissionAndSystemAndTester($missionId,$userId,$appId);
    }

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
                }

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
//     public function updateExecution($executionId, $data)
// {
//     $executionData = [
//         'id' => $executionId,
//         'cntrl_modification' => $data['description'],
//         'ipe' => $data['ipe'],
//         'design' => $data['design'],
//         'effectiveness' => $data['effectiveness'],
//         'status_id' => $data['status_id'],
//         'comment' => $data['comment'],
//     ];

//     // Mise à jour de l'exécution
//     $execution = $this->executionRepository->updateExecution($executionId, $executionData);

//     if ($execution) {
//         // Si des fichiers sont envoyés, on les traite
//         if (isset($data['files'])) {
//             // Ajouter `execution_id` à chaque fichier
//             foreach ($data['files'] as &$fileData) {
//                 $fileData['execution_id'] = $executionId; // Ajout de l'ID d'exécution à chaque fichier
//             }

//             // On envoie les fichiers au service de stockage
//             $this->evidenceService->storeFiles($data['files']);
//         }
//     }
// }

public function updateExecution($executionId, $data)
{
    $executionData = [
        'id' => $executionId,
        'cntrl_modification' => $data['description'] ?? null,
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

    if (!empty($riskFilteredData) ) {
       $this->covRepository->updateCoverage($executionId, $riskFilteredData);
    }

    $filteredData = array_filter($executionData, function ($value) {
        return !is_null($value);
    });

    // Mise à jour de l'exécution
    return $execution = $this->executionRepository->updateExecution($executionId, $filteredData);

   
}

public function updateMultipleExecutions(array $executionsData)
{
    DB::beginTransaction();

    try {
        foreach ($executionsData as $executionData) {
            // Assure-toi que chaque élément a un ID d'exécution
            if (!isset($executionData['executionId'])) {
                throw new \Exception("Execution ID is required for update.");
            }

            $this->updateExecution($executionData['executionId'], $executionData);
        }

        DB::commit();
        return true;

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("Error updating multiple executions", ['error' => $e->getMessage()]);
        throw new \Exception("Error while updating executions");
    }
}


public function launchExecution($executionId)
{
    $raw=[
        'launched_at' => now(),
    ];
    return $this->executionRepository->updateAnExecutionRaw($executionId , $raw);
}
}
