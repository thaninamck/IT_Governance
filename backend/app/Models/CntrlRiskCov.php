<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CntrlRiskCov extends Model
{
    protected $fillable = [
        'risk_id',
        'risk_modification',
        'risk_owner',
        'execution_id',
        'layer_id',
    ];
        public function execution(){
        return $this->belongsTo(Execution::class);
    }
    public function risk(){
        return $this->belongsTo(Risk::class);
    }
    public function layer(){
        return $this->belongsTo(Layer::class);
    }

}
