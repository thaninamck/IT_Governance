<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remark extends Model
{
    protected $fillable = [
        'text',
        'y',
        'user_id',
        'execution_id'
        
    ];

    
}
