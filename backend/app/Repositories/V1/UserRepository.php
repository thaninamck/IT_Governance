<?php

namespace App\Repositories\V1;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\Position;
use App\Models\User;
class UserRepository
{
    public function getAllUsers()
    {
        return User::with(['position'])->get();
    }

    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function resetUser(int $id, string $password): ?User
{
    $user = User::find($id);

    if (!$user) {
        return null;
    }

    // 🔹 Mettre à jour le mot de passe (hashé)
    $user->password = $password;
    $user->must_change_password = true;
    $user->save();

    return $user;
}
    public function blockUser(int $id): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->is_active = false;
        $user->save();

        return $user;
    }


    public function unblockUser(int $id): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->is_active = true;
        $user->save();

        return $user;
    }
    public function updateUser($id, array $data): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->update($data);

        return $user;
    }
    public function findUserById(int $id)
    {
        return User::find($id);
    }
    public function hasRelatedData(User $user): bool
    {
        return $user->notifications()->exists() ||
            $user->participations()->exists() ||
            $user->executions()->exists();
    }

    public function deleteUser(int $id): ?string
    {
        $user = User::find($id);
    
        if (!$user) {
            return null;
        }
    
        $email = $user->email; 
        $user->delete();
    
        return $email; 
    }
    


    public function createMultipleUsers(array $usersData)
    {
        $createdUsers = [];

        foreach ($usersData as $userData) {
            $createdUsers[] = User::create($userData);
        }

        return collect($createdUsers);
    }

    public function getUsersByIds($userIds)
    {
        return User::whereIn('id', $userIds)->get();
    }

    public function createGrade(string $name):Position
{
    return Position::create(['name' => $name]);
}

public function findGradeById(int $id)
{
    return Position::find($id);
}

public function deleteGrade(int $id): ?string
{
    $grade=Position::find($id);
    if(!$grade){
        return null;
    }
    $name= $grade->name;
    $grade->delete();

    return $name;
}
}
