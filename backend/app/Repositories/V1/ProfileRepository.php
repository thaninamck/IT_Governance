<?php

namespace App\Repositories\V1;

use App\Models\Profile;

class ProfileRepository
{
    public function getAllProfiles()
    {
        return Profile::all();
    }
    public function createProfile(string $name):Profile
    {
        return Profile::create($name);
    }


}
