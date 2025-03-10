<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Control extends Model
{
 use HasFactory;
    protected $fillable = ['code',  'is_archived', 'type_id', 'major_id','sub_id', 'description'];


    public function type(){
        return $this->belongsTo(Type::class);
    }
    public function majorProcess(){
        return $this->belongsTo(MajorProcess::class,'major_id');
    }
    public function subProcess(){
        return $this->belongsTo(SubProcess::class,'sub_id');
    }

    public function sources()
{
    return $this->belongsToMany(Source::class, 'cntrl_srcs', 'control_id', 'source_id');
}

    public function steps()
    {
        return $this->hasMany(StepTestScript::class);
    }
}
