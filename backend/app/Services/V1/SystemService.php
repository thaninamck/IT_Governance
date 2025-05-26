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
            'owner_id' => $owner->id,
            'mission_id' => $missionId,
        ]);

        // Associer au système à la mission
       // $this->missionRepository->attachSystem($missionId, $system->id);

// // Créer les layers et les associer au système
// $layers = [];
// foreach ($data['layerName'] as $layerName) {
//     $layer = $this->layerService->createLayer($layerName,$system->id);
//     $layers[] = $layer; // Stocke les layers créés
// }

// Créer les layers uniquement s'ils n'existent pas
$layers = [];
foreach ($data['layerName'] as $layerName) {
    $existingLayer = $this->layerService->findLayerByNameAndSystemId($layerName, $system->id);

    if (!$existingLayer) {
        $layer = $this->layerService->createLayer($layerName, $system->id);
        $layers[] = $layer;
    } else {
        $layers[] = $existingLayer; // Optionnel : ajouter même les existants à la liste
    }
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

  

    public function updateSystem($missionId,$id, array $data): ?System
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

    public function deleteSystem(int $missionId,int $id): ?string
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

public function getsystemInfo($systemId)
{
    $system=$this->systemRepository->getsystemInfo($systemId);
   
    if (!$system) {
        return null; // ou lancer une exception
    }

     return 
     //$system;
    [
        'id' => $system->id,
        'systemName' => $system->name,
        'description' => $system->description,
        'missionId' => $system->mission_id,
        'ownerId' => $system->owner_id,
        'ownerName'=>$system->owner->full_name,
        'ownerEmail' => $system->owner->email,  
        'layers' => $system->layers->map(function ($layer) {
                    return [
                        'id' => $layer->id,
                        'name' => $layer->name
                    ];
                })->toArray()
            
    ];
}

public function getsystemById($userId,$systemId)
{
    $system=$this->systemRepository->getsystemById($userId,$systemId);
   
    if (!$system) {
        return null; // ou lancer une exception
    }
    $participation = $system->mission->participations->first();

     return 
     //$system;
    [
        'id' => $system->id,
        'systemName' => $system->name,
        'description' => $system->description,
        'missionId' => $system->mission_id,
       'missionName' => $system->mission?->mission_name,
        'ownerId' => $system->owner_id,
        'ownerName'=>$system->owner?->full_name,
        'ownerEmail' => $system->owner->email, 
        'role' => $participation?->user?->role,
        'userName'=> $participation?->user?->first_name .' '. $participation?->user?->last_name,
        'profile' => $participation?->profile?->profile_name,
        'layers' => $system->layers->map(function ($layer) {
                    return [
                        'id' => $layer->id,
                        'name' => $layer->name
                    ];
                })->toArray()
            
    ];
}

}