<?php

namespace App\Repositories\V1;

use App\Models\Remediation;

class RemediationRepository
{
    public function getAllRemediationByControl(){
        return Remediation::with(['control'])->get();
    }

    public function createRemediationForControl(array $data):Remediation
    {
        return Remediation::create($data);
    }

    public function updateRemediation($id, array $data): ?Remediation
    {
        $remediation = Remediation::find($id);

        if (!$remediation) {
            return null;
        }

        $remediation->update($data);

        return $remediation;
    }

    public function findRemediationById(int $id)
    {
        return Remediation::find($id);
    }

    public function deleteRemediation(int $id): ?string
    {
        $remediation=Remediation::find($id);

        if (!$remediation) {
            return null;
        }

        $remediation_id=$remediation->id;
        $remediation->delete();

        return $remediation_id;
    }

}
