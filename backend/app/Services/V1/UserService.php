<?php
namespace App\Services\V1;

use App\Repositories\V1\UserRepository;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class UserService
{

    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers()
    {
        return $this->userRepository->getAllUsers();
    }

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return $this->userRepository->createUser($data);
    }

    public function resetUser($id)
{
    $user = $this->userRepository->resetUser($id);

    if ($user) {
        return ['email' => $user->email]; 
    }

    return null;
}

    public function blockUser($id)
    {
        $user = $this->userRepository->blockUser($id);

        if ($user) {
            return ['email' => $user->email]; 
        }

        return null;
    }

    public function unblockUser($id)
    {
        $user = $this->userRepository->unblockUser($id);

        if ($user) {
            return ['email' => $user->email]; 
        }

        return null;    }

    public function updateUser($id, array $data): ?User
    {
        return $this->userRepository->updateUser($id, $data);
    }

    public function deleteUser(int $id): ?string
{
    $user = $this->userRepository->findUserById($id);

    if (!$user) {
        return null;
    }

    if ($this->userRepository->hasRelatedData($user)) {
        throw new \Exception("Impossible de supprimer cet utilisateur, des données lui sont encore associées.");
    }

    return $this->userRepository->deleteUser($id); // Retourne l'email au contrôleur
}


    public function createMultipleUsers(array $usersData)
    {

        foreach ($usersData as &$userData) {
            $userData['password'] = Hash::make($userData['password']);
            $userData['role'] = 0;
            $userData['is_active'] = false;
            $userData['must_change_password'] = true;
            $userData['last_activity'] = now();
            $userData['created_at'] = now();
            $userData['updated_at'] = now();
        }

        return $this->userRepository->createMultipleUsers($usersData);

    }
}
