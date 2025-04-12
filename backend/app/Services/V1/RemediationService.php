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

    public function getAllRemediationByControl()
    {
        return $this->remediationRepository->getAllRemediationByControl();
    }
   
    public function createRemediationForControl(array $data): Remediation
{
        $remediation = $this->remediationRepository->createRemediationForControl($data);

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

}