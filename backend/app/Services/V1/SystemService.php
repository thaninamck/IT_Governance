<?php

namespace App\Services\V1;

use App\Models\System;
use App\Repositories\V1\LayerRepository;
use App\Repositories\V1\MissionRepository;
use App\Repositories\V1\SystemRepository;

class SystemService
{
    protected SystemRepository $systemRepository;
    protected MissionRepository $missionRepository;
    protected LayerService $layerService; 
    protected OwnerService $ownerService;

    public function __construct(SystemRepository $systemRepository,OwnerService $ownerService, MissionRepository $missionRepository,LayerService $layerService)
    {
        $this->systemRepository=$systemRepository;
        $this->ownerService = $ownerService;
        $this->missionRepository = $missionRepository;
        $this->layerService=$layerService;
    }

    public function getAllSystems()
    {
        return $this->systemRepository->getAllSystems();
    }
   

    // public function createSystem(array $data): System
    // {
    //      // Vérifier si le propriétaire existe déjà
    //      $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);
    //      // Si le propriétaire n'existe pas, le créer
    //      if (!$owner) {
    //         $ownerData = [
    //             'full_name' => $data['full_name'],
    //             'email' => $data['email'],
    //         ];
    //         $owner = $this->ownerService->createOwner($ownerData);
    //     }

    //     // Créer le système avec l'ID du propriétaire
    //     $systemData = [
    //         'name' => $data['name'],
    //         'description' => $data['description'],
    //         'owner_id' => $owner->id,
    //     ];

    //     return $this->systemRepository->createSystem($systemData);
    // }

    public function createSystemForMission(array $data, int $missionId): System
{
   
        // Vérifier/Créer le propriétaire
        $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);
        
        if (!$owner) {
            $owner = $this->ownerService->createOwner([
                'full_name' => $data['full_name'],
                'email' => $data['email']
            ]);
        }

        // Créer le système
        $system = $this->systemRepository->createSystem([
            'name' => $data['name'],
            'description' => $data['description'],
            'owner_id' => $owner->id
        ]);

        // Associer au système à la mission
        $this->missionRepository->attachSystem($missionId, $system->id);

// Créer les layers et les associer au système
$layers = [];
foreach ($data['layerName'] as $layerName) {
    $layer = $this->layerService->createLayer($layerName,$system->id);
    $layers[] = $layer; // Stocke les layers créés
}

// Charger les layers pour la réponse
$system->load('layers');


       
        return $system;


}

    // public function updateSystem($id ,array $data):?System
    // {
    //     // Trouver le système à mettre à jour
    // $system = $this->systemRepository->findSystemById($id);

    // if (!$system) {
    //     return null; // Retourner null si le système n'existe pas
    // }

    //     // Vérifier si le propriétaire existe déjà
    // $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);

    // // Si le propriétaire n'existe pas, le créer
    // if (!$owner) {
    //     $ownerData = [
    //         'full_name' => $data['full_name'],
    //         'email' => $data['email'],
    //     ];
    //     $owner = $this->ownerService->createOwner($ownerData);
    // }

    // // Mettre à jour le système avec l'ID du propriétaire
    // $systemData = [
    //     'name' => $data['name'],
    //     'description' => $data['description'],
    //     'owner_id' => $owner->id,
    // ];

    // return $this->systemRepository->updateSystem($id, $systemData);
    // }

  

    public function updateSystem($id, array $data): ?System
    {
        // Trouver le système à mettre à jour avec ses layers
        $system = $this->systemRepository->findSystemById($id);
        if (!$system) {
            return null;
        }
    
        // Vérifier/Créer le propriétaire
        $owner = $this->ownerService->findOwnerByFullNameAndEmail($data['full_name'], $data['email']);
        if (!$owner) {
            $owner = $this->ownerService->createOwner([
                'full_name' => $data['full_name'],
                'email' => $data['email']
            ]);
        }
    
        // Mettre à jour les données de base du système
        $updatedSystem = $this->systemRepository->updateSystem($id, [
            'name' => $data['name'],
            'description' => $data['description'],
            'owner_id' => $owner->id
        ]);
    
        // Gestion des layers si présents dans les données
        if (isset($data['layerName'])) {
            // Récupérer les noms des layers existants
            $existingLayers = $system->layers->pluck('name')->toArray();
            
            // Récupérer les nouveaux layers depuis la requête
            $newLayers = $data['layerName'];
            
            // Layers à supprimer (existants mais pas dans la nouvelle liste)
            $layersToDelete = array_diff($existingLayers, $newLayers);
            
            // Layers à créer (nouveaux mais pas dans les existants)
            $layersToCreate = array_diff($newLayers, $existingLayers);
    
            // Supprimer les layers qui ne sont plus nécessaires
            foreach ($system->layers as $layer) {
                if (in_array($layer->name, $layersToDelete)) {
                    $this->layerService->deleteLayer($layer->id);
                }
            }
    
            // Créer les nouveaux layers
            foreach ($layersToCreate as $layerName) {
                $this->layerService->createLayer($layerName, $system->id);
            }
        }
    
        // Recharger les relations pour la réponse
        $updatedSystem->load('layers');
    
        return $updatedSystem;
    }

    public function deleteSystem(int $id): ?string
{
    $system = $this->systemRepository->findSystemById($id);
    if (!$system) {
        return null;
    }

    // Récupérer toutes les couches associées au système
    $layers = $system->layers; // Assurez-vous que la relation est définie dans le modèle System

    // Supprimer toutes les couches associées
    foreach ($layers as $layer) {
        $this->layerService->deleteLayer($layer->id);
    }

    // Supprimer le système
    return $this->systemRepository->deleteSystem($id);
}

}