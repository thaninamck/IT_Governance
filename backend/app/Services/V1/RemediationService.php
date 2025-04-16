<?php

namespace App\Services\V1;

use App\Models\Execution;
use App\Models\Remediation;
use App\Repositories\V1\RemediationRepository;
use App\Repositories\V1\StatusRepository;

class RemediationService
{
    protected RemediationRepository $remediationRepository;
    protected $statusRepository;
   
    public function __construct(RemediationRepository $remediationRepository,StatusRepository $statusRepository)
    {
        $this->remediationRepository=$remediationRepository;
        $this->statusRepository = $statusRepository;
    }

    public function getRemediationStatusOptions()
    {
        return $this->statusRepository->getRemediationStatusOptions();
    }

    public function closeRemediation(int $id):Remediation
    {
        return $this->remediationRepository->closeRemediation($id);
    }
    public function updateStatusRemediation(int $id):Remediation
    {
        return $this->remediationRepository->updateStatusRemediation($id);
    }
    public function getAllRemediationsByExecution($executionId)
    {
        return $this->remediationRepository->getAllRemediationsByExecution($executionId);
    }
   
    public function createRemediationForExecution(array $data,int $executionId,$controlId): Remediation
{
    $actionName = $this->generateActionName($executionId ,$controlId);

        $remediation = $this->remediationRepository->createRemediationForControl([
            'description'=>$data['description'],
            'owner_cntct'=>$data['owner_cntct'],
            'start_date'=>$data['start_date'],
            'end_date'=>$data['end_date'],
         //  'action_name'=>$data['action_name'],
         "action_name"=> $actionName,
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


    private function generateActionName(int $executionId ,string $controlId): string
{
    
    $now = now();
    $mois = ucfirst($now->locale('fr_FR')->isoFormat('MMM')); // Ex: "Avr"
    $annee = $now->format('y'); // Ex: "25"
    $prefixDate = "{$mois}{$annee}";
    $prefix = "ACT_{$prefixDate}_{$controlId}_";

    // Récupère tous les action_name existants pour ce mois+année
    $existing = Remediation::where('action_name', 'like', "ACT_{$prefixDate}_%")
        ->pluck('action_name')
        ->toArray();

    // Extrait les numéros déjà utilisés
    $usedNumbers = collect($existing)
        ->map(function ($name) {
            preg_match('/_(\d{3})$/', $name, $matches);
            return $matches[1] ?? null;
        })
        ->filter()
        ->unique()
        ->values();

    // Génère un numéro libre
    do {
        $numeroSequentiel = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
    } while ($usedNumbers->contains($numeroSequentiel));

    return $prefix . $numeroSequentiel;
}


}