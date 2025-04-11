<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StepExecution extends Model
{
    protected $table = 'step_executions';
    protected $fillable = [
        'execution_id',
        'step_id',
        'checked',
        'comment',
        
    ];

    public function execution()
    {
        return $this->belongsTo(Execution::class);
    }

    public function step()
    {
        return $this->belongsTo(StepTestScript::class, 'step_id');
    }

  
}
