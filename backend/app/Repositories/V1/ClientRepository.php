<?php

namespace App\Repositories\V1;

use App\Models\Client;

class ClientRepository
{
    public function getAllClients()
    {
        return Client::all();
    }

    public function createClient(array $data):Client
    {
        return Client::create($data);
    }

    public function updateClient($id,array $data): ?Client
    {
        $client=Client::find($id);

        if(!$client){
            return null;
        }
        
        $client->update($data);
        
        return $client;
    }

    public function findClientById(int $id)
    {
        return Client::find($id);
    }

    public function deleteClient(int $id) : ?string
    {
        $client =Client::find($id);
        if (!$client){
            return null;
        }

        $commercial_name= $client->commercial_name;
        $client->delete();

        return $commercial_name;

    }

    public function createMultipleClients(array $clientsData)
    {
        $createdClients= [];

        foreach ($clientsData as $clientData){
            $createdClients[]=Client::create($clientData);
        }
        return collect($createdClients);
    }


}
