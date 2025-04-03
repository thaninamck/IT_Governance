<?php
namespace App\Services\V1;

use App\Repositories\V1\ProfileRepository;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    protected ProfileRepository $profileRepository;
    
    public function __construct(ProfileRepository $profileRepository)
    {
        $this->profileRepository=$profileRepository;
    }

    public function getAllProfiles()
    {
        return $this->profileRepository->getAllProfiles();
    }
}