<?php

namespace App\Repositories\V1;

use App\Models\System;

class SystemRepository
{
    public function getAllSystems()
    {
        return System::with(['owner'])->get();
    }

    public function createSystem(array $data): System
    {
        return System::create($data);
    }

    public function updateSystem($id, array $data): ?System
    {
        $system = System::find($id);

        if (!$system) {
            return null;
        }

        $system->update($data);

        return $system;
    }

    public function findSystemById(int $id)
    {
        return System::find($id);
    }

    public function deleteSystem(int $id): ?string
    {
        $system=System::find($id);

        if (!$system) {
            return null;
        }
        // Supprimer d'abord les associations dans mission_systems
    $system->missions()->detach();

        $system_name=$system->name;
        $system->delete();

        return $system_name;
    }

    
}
