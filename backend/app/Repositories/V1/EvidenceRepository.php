<?php

namespace App\Repositories\V1;
use App\Models\Evidence;
class EvidenceRepository
{
    public function storeEvidence(array $data,$fileName)
    {
        
        // Créer l'enregistrement en BDD
        return Evidence::firstOrCreate([
            'file_name' => $fileName,
            'is_f_test' => $data['is_f_test'] ?? false,
            'execution_id' => $data['execution_id'] ?? null,
        ]);
    }

   

    public function getByExecution($executionId)
    {
        return Evidence::where('execution_id', $executionId)->get();
    }

    public function getByRemediation($remediationId)
    {
        return Evidence::where('remediation_id', $remediationId)->get();
    }

    public function deleteEvidence($evidenceId)
{
    $evidence = Evidence::find($evidenceId);

    if (!$evidence) {
        return false; 
    }

    
    Evidence::destroy($evidenceId);
    return $evidence->file_name;
}


}
