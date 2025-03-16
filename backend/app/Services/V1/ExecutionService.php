<?php
namespace App\Services\V1;

use App\Models\execution;
use App\Repositories\V1\ExecutionRepository;
use App\Repositories\V1\CntrlRiskCovRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class ExecutionService
{
    protected ExecutionRepository $executionRepository;
    protected CntrlRiskCovRepository $covRepository;

    public function __construct(ExecutionRepository $executionRepository, CntrlRiskCovRepository $covRepository)
    {
        $this->executionRepository =$executionRepository;
        $this->covRepository =$covRepository;
    }

    public function getExecutionsByMission($missionId)
    {
        return $this->executionRepository->getExecutionsByMission($missionId);
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
                $executionToInsert['missionId'] = $execution['missionId'];

                $lastExecution = $this->executionRepository->createExecution($executionToInsert);

                if (!$lastExecution) {
                    throw new \Exception("Failed to create execution");
                }

                $coverageToInsert['riskDescription'] = $execution['riskModified'] ? $execution['riskDescription'] : null;


                $coverageToInsert['riskId'] = $execution['riskId'];
                $coverageToInsert['execution_id'] = $lastExecution->id;
                $coverageToInsert['riskOwner'] = $execution['riskOwner'];
                $coverageToInsert['layerId'] = $execution['layerId'];

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

    
}
