<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remediation extends Model
{
    protected $fillable=[
        'execution_id',
        'follow_up',
        'owner_cntct',
        'description',
        'start_date',
        'end_date',
        'status_id',
        'action_name',
    ];

    public function execution(){
        return $this->belongsTo(Execution::class);
    }
    public function status(){
        return $this->belongsTo(Status::class);
    }
    public function remediationEvidence(){    
        return $this->hasMany(RemediationEvidence::class);
    }
}
