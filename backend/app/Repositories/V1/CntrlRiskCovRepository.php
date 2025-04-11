<?php

namespace App\Repositories\V1;
use App\Models\CntrlRiskCov;
use Log;
class CntrlRiskCovRepository
{
    public function createCoverage($data)
    {
        Log::info(' Data:', $data);

        return CntrlRiskCov::create(
            [
                'risk_id' => $data['riskId'],
                'execution_id' => $data['execution_id'],
                'risk_owner' => $data['riskOwner'],
                'risk_modification' => $data['riskDescription'],
            ]

        );
    }

    public function updateCoverage($executionId ,$data)
    {
       

        return CntrlRiskCov::where('execution_id', $executionId)->update($data);
    }
}
