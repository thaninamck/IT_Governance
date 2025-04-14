<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StepTestScript extends Model
{
   protected $fillable=['text','control_id'];
   public function control(){
       return $this->belongsTo(Control::class);
   }

   public function executions()
   {
       return $this->belongsToMany(Execution::class, 'step_executions', 'step_id', 'execution_id');
   }
}
