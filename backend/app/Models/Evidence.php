<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evidence extends Model
{
    protected $table = 'execution_evidences';
    protected $fillable=[
        "file_name",
        "stored_name",
        "is_f_test",
        "execution_id",
        
    ];
    public function execution()
    {
        return $this->belongsTo(Execution::class);
    }
}
