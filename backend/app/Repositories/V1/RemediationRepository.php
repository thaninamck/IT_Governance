<?php

namespace App\Repositories\V1;

use App\Models\Remediation;

class RemediationRepository
{
    public function getAllRemediationsByExecution(int $executionId){
      // return  Remediation::with('execution')->where('execution_id', $executionId)->get();

      return Remediation::with(['execution.user', 
      'execution.user.participations.profile',
      'execution.layer',
      'execution.status',
      'execution.layer.system.owner',
      'execution.layer.system',
      'execution.layer.system.mission', 
      'execution.coverage', 
      'execution.steps.control',
      'status']) // Ajoute ici ce que tu veux charger
        ->where('execution_id', $executionId)
        ->get();
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
    public function getRemediationInfo($remediationId)
    {
        $remediation= Remediation::with(['remediationEvidence'])->find($remediationId);
    
        return $remediation;
    }
    public function closeRemediation(int $id):?Remediation
    {
        $remediation=Remediation::find($id);

        if(!$remediation){
            return null;
        }
        
         // Mettre à jour le statut de la remediation
         $remediation->status_id = 1; //close remediation
         $remediation->save();

        return $remediation;
    }
    public function updateStatusRemediation(int $id):?Remediation
    {
        $remediation=Remediation::find($id);

        if(!$remediation){
            return null;
        }
        
         // Mettre à jour le statut de la remediation
         $remediation->status_id = 17; //close remediation
         $remediation->save();

        return $remediation;
    }

}
