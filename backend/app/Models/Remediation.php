<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remediation extends Model
{
    protected $fillable=[
        'execution_id','follow_up','owner_cntct','description'
    ];

    public function control(){
        return $this->belongsTo(Execution::class);
    }
   
}
