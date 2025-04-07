<?php

namespace App\Repositories\V1;
use App\Models\Evidence;
class EvidenceRepository
{
    public function storeEvidence(array $data,$fileName)
    {
        
        // Créer l'enregistrement en BDD
        return Evidence::create([
            'file_name' => $fileName,
            'is_f_test' => $data['is_f_test'] ?? false,
            'execution_id' => $data['execution_id'] ?? null,
            'remediation_id' => $data['remediation_id'] ?? null,
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

    public function download(Evidence $evidence)
    {
        $path = storage_path("app/public/evidences/{$evidence->file_name}");

        if (!file_exists($path)) {
            abort(404, 'Fichier introuvable');
        }

        return response()->download($path, $evidence->file_name);
    }
}
