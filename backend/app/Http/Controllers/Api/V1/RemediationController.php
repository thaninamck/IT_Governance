<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\RemediationResource;
use App\Models\Remediation;
use App\Services\LogService;
use App\Services\V1\RemediationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RemediationController extends BaseController
{

    protected $remediationService;
    protected $logService;

    public function __construct(RemediationService $remediationService ,LogService $logService)
    {
        $this->logService = $logService;
        $this->remediationService=$remediationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        $remediations=$this->remediationService->getAllRemediationByControl();

        if($remediations->isEmpty()){
            return $this->sendError("no remediations found",[]);
        }
        return $this->sendResponse(RemediationResource::collection($remediations),'remediations retrieved successfully');
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
    public function show(Remediation $remediation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Remediation $remediation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Remediation $remediation)
    {
        //
    }
}
