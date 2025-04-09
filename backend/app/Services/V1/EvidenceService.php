<?php
namespace App\Services\V1;

use App\Models\execution;
use App\Repositories\V1\EvidenceRepository;
use App\Repositories\V1\CntrlRiskCovRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
class EvidenceService
{
    protected EvidenceRepository $evidenceRepository;


    public function __construct(EvidenceRepository $evidenceRepository)
    {
        $this->evidenceRepository = $evidenceRepository;

    }

    public function storeFile($data, $file)
    {
        // Générer un nom unique
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();

        // Stocker le fichier
        $file->storeAs('evidences', $fileName, 'public'); // dans storage/app/public/evidences
       return $createdEvidence=$this->evidenceRepository->storeEvidence($data, $fileName);

    }


    public function storeFiles($filesData)
{
    $createdEvidences = [];  

    foreach ($filesData as $fileData) {
        $data=[
            'is_f_test' => $fileData['is_f_test'] ?? false,
            'execution_id' => $fileData['execution_id'] ?? null,
            'remediation_id' => $fileData['remediation_id'] ?? null,
        ];
        $createdEvidences[] = $this->storeFile($data, $fileData['file']);
    }

    return $createdEvidences; 
}



/*
dans le frontend si tu veux acceder a un ficher specifique dans ton clique appelle :
    http://127.0.0.1:8000(ou le domaine final)/storage/evidences/nom_du_fichier (ex:67f4171ced2cb.xlsx)

*/ 




    public function getFileByExecutionId($executionId)
    {
        $evidences = $this->evidenceRepository->getByExecution($executionId);
        if ($evidences) {
            return $evidences;
        } else {
            return null;
        }
    }

    public function getFileByRemediationId($remediationId)
    {
        $evidence = $this->evidenceRepository->getByRemediation($remediationId);
        if ($evidence) {
            return $evidence;
        } else {
            return null;
        }
    }

    public function deleteFile($evidenceId)
{
    $deletedFileName = $this->evidenceRepository->deleteEvidence($evidenceId);

    if ($deletedFileName) {
        // Supprimer le fichier du disque
        $filePath = 'evidences/' . $deletedFileName;
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        return true;
    }

    return false;
}
}