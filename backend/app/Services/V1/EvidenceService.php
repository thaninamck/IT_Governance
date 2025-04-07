<?php
namespace App\Services\V1;

use App\Models\execution;
use App\Repositories\V1\EvidenceRepository;
use App\Repositories\V1\CntrlRiskCovRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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


    public function storeFiles($data, $files)
{
    $createdEvidences = [];  

    foreach ($files as $file) {
        $createdEvidences[] = $this->storeFile($data, $file);
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
}