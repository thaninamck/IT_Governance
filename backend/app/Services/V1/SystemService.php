<?php

namespace App\Services\V1;

use App\Models\System;
use App\Repositories\V1\SystemRepository;

class SystemService
{
    protected SystemRepository $systemRepository;
    protected OwnerService $ownerService;

    public function __construct(SystemRepository $systemRepository,OwnerService $ownerService)
    {
        $this->systemRepository=$systemRepository;
        $this->ownerService = $ownerService;
    }

    public function getAllSystems()
    {
        return $this->systemRepository->getAllSystems();
    }
   

    public function createSystem(array $data): System
    {
         // Vérifier si le propriétaire existe déjà
         $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);
         // Si le propriétaire n'existe pas, le créer
         if (!$owner) {
            $ownerData = [
                'full_name' => $data['full_name'],
                'email' => $data['email'],
            ];
            $owner = $this->ownerService->createOwner($ownerData);
        }

        // Créer le système avec l'ID du propriétaire
        $systemData = [
            'name' => $data['name'],
            'description' => $data['description'],
            'owner_id' => $owner->id,
        ];

        return $this->systemRepository->createSystem($systemData);
    }
    public function updateSystem($id ,array $data):?System
    {
        // Trouver le système à mettre à jour
    $system = $this->systemRepository->findSystemById($id);

    if (!$system) {
        return null; // Retourner null si le système n'existe pas
    }

        // Vérifier si le propriétaire existe déjà
    $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);

    // Si le propriétaire n'existe pas, le créer
    if (!$owner) {
        $ownerData = [
            'full_name' => $data['full_name'],
            'email' => $data['email'],
        ];
        $owner = $this->ownerService->createOwner($ownerData);
    }

    // Mettre à jour le système avec l'ID du propriétaire
    $systemData = [
        'name' => $data['name'],
        'description' => $data['description'],
        'owner_id' => $owner->id,
    ];

    return $this->systemRepository->updateSystem($id, $systemData);
    }
    public function deleteSystem(int $id):?string
    {
        $system=$this->systemRepository->findSystemById($id);
        if(!$system){
            return null;
        }
        return $this->systemRepository->deleteSystem($id);
    }

}