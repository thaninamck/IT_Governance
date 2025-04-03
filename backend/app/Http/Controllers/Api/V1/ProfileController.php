<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProfileResource;
use App\Models\Profile;
use App\Services\V1\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends BaseController
{
    protected $profileService;
    
    public function __construct(ProfileService $profileService)
    {
        $this->profileService=$profileService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $profile=$this->profileService->getAllProfiles();

        if($profile->isEmpty()){
            return $this->sendError("no profile found",[]);
        }
        return $this->sendResponse(ProfileResource::collection($profile),"profils retrived successfully");
   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Profile $profile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Profile $profile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Profile $profile)
    {
        //
    }
}
