<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Remediation extends Model
{
    protected $fillable=['control_id'];
    public function control(){
        return $this->belongsTo(Control::class);
    }
}
