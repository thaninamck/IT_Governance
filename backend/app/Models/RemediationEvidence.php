<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemediationEvidence extends Model
{
    protected $table = 'remediation_evidences';

    use HasFactory;
    protected $fillable=[
        "file_name",
         "remediation_id",
         "stored_name",
    ];

    public function remediation(){
        return $this->belongsTo(Remediation::class);
    }

    
}
