<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class remarks extends Model
{
    protected $fillable = [
        'text',
        'y',
        'user_id',
        'execution_id'
        
    ];

    
}
