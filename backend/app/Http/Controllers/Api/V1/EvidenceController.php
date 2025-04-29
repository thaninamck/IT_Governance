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

public function destroyRemediation( $evidenceId)
{
    try {
        $this->evidenceService->deleteRemediationFile($evidenceId);
        return $this->sendResponse("File deleted successfully","");
    } catch (\Exception $e) {
        Log::error('Error deleting file: ' . $e->getMessage());
        }
    
}
public function storeRemediationMultiple(Request $request)
{
    Log::info('Request data: ', $request->all());
    Log::info('Uploaded files: ', $request->file());

    try {
        $filesData = [];
        
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $index => $file) {
                $filesData[] = [
                    'file' => $file,
                    'remediation_id' => $request->input("files.$index.remediation_id"),
                ];
            }
        }

        $evidences=$this->evidenceService->storeRemediationFiles($filesData);

        return $this->sendResponse($evidences, 'All files uploaded successfully.');
    } catch (\Exception $e) {
        Log::error('Multiple upload error: ' . $e->getMessage());
        return $this->sendError('Upload failed', [], 500);
    }
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


    public function storeMultiple(Request $request)
{
    Log::info('Request data: ', $request->all());
    Log::info('Uploaded files: ', $request->file());

    try {
        $filesData = [];
        
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $index => $file) {
                $filesData[] = [
                    'file' => $file,
                    'execution_id' => $request->input("files.$index.execution_id"),
                    'is_f_test' => $request->input("files.$index.is_f_test"),
                ];
            }
        }

        $evidences=$this->evidenceService->storeFiles($filesData);

        return $this->sendResponse($evidences, 'All files uploaded successfully.');
    } catch (\Exception $e) {
        Log::error('Multiple upload error: ' . $e->getMessage());
        return $this->sendError('Upload failed', [], 500);
    }
}
    

    
    
    



}
