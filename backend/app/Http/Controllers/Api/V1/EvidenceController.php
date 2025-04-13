<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Evidence;
use Illuminate\Http\Request;
use App\Services\V1\EvidenceService;
use Log;
class EvidenceController extends BaseController
{
    
protected $evidenceService;
public function __construct(EvidenceService $evidenceService)
{
    $this->evidenceService = $evidenceService;
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $evidenceId)
    {
        try {
            $this->evidenceService->deleteFile($evidenceId);
            return $this->sendResponse("File deleted successfully","");
        } catch (\Exception $e) {
            Log::error('Error deleting file: ' . $e->getMessage());
            }
        
    }
}
