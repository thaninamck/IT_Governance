<?php
namespace App\Services\V1;

use App\Models\Client;
use App\Repositories\V1\ClientRepository;

class ClientService
{
    protected ClientRepository $clientRepository;

    public function __construct(ClientRepository $clientRepository)
    {
        $this->clientRepository =$clientRepository;
    }

    public function getAllClients()
    {
        return $this->clientRepository->getAllClients();
    }

    public function createClient(array $data): Client
    {
        return $this->clientRepository->createClient($data);
        
    }

    public function updateClient($id ,array $data):?Client
    {
        return $this->clientRepository->updateClient($id ,$data);
    }

    public function deleteClient(int $id):?string
    {
        $client=$this->clientRepository->findClientById($id);

        if(!$client){
            return null;
        }
        return $this->clientRepository->deleteClient($id);
    }

    public function createMultipleClients(array $clientsData){

       return $this->clientRepository->createMultipleClients($clientsData);
    }
}
