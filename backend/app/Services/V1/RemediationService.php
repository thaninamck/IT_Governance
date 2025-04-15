<?php

namespace App\Services\V1;

use App\Models\Remediation;
use App\Repositories\V1\RemediationRepository;

class RemediationService
{
    protected RemediationRepository $remediationRepository;
   
    public function __construct(RemediationRepository $remediationRepository)
    {
        $this->remediationRepository=$remediationRepository;
    }

    public function getAllRemediationsByExecution($executionId)
    {
        return $this->remediationRepository->getAllRemediationsByExecution($executionId);
    }
   
    public function createRemediationForExecution(array $data,int $executionId): Remediation
{
        $remediation = $this->remediationRepository->createRemediationForControl([
            'description'=>$data['description'],
            'owner_cntct'=>$data['owner_cntct'],
           // 'follow_up'=>$data['follow_up'],
            'execution_id'=>$executionId,
        ]);

        return $remediation;
}

    public function updateRemediatio($id, array $data): ?Remediation
    {
        $remediation = $this->remediationRepository->findRemediationById($id);
        if (!$remediation) {
            return null;
        }
        $updatedRemediation = $this->remediationRepository->updateRemediation($id,$data);
    
        return $updatedRemediation;
    }

    public function deleteRemediation(int $id): ?string
{
    $remediation = $this->remediationRepository->findRemediationById($id);
    if (!$remediation) {
        return null;
    }
    return $this->remediationRepository->deleteRemediation($id);
}

public function getRemediationInfo($remediationId)
    {
        $remediation =$this->remediationRepository->getRemediationInfo($remediationId);

        if (! $remediation) {
            return null; // ou lancer une exception
        }
        return $remediation;
    }

}