<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
class Source extends Model
{
    use HasFactory;
    protected $fillable = ['name'] ;

    
    public function controls()
    {
        return $this->belongsToMany(Control::class,'cntrl_srcs','control_id','source_id');
    }
    
}
