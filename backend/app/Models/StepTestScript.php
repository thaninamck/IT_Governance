<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StepTestScript extends Model
{
   protected $fillable=['text','control_id'];
   public function control(){
       return $this->belongsTo(Control::class);
   }
}
