<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evidence extends Model
{
    protected $table = 'evidences';
    protected $fillable=[
        "file_name",
        "is_f_test",
        "execution_id",
        "remediation_id",
        
    ];
}
