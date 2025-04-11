<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Execution extends Model
{
    use HasFactory;
    protected $fillable = [
        'cntrl_modification',
        'remark',
        'control_owner',
        'launched_at',
        'ipe',
        'effectiveness',
        'design',
        'user_id',
        'control_id',
        'status_id',
        'mission_id',
        'layer_id'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function control()
    {
        return $this->belongsTo(Control::class);
    }
    public function coverage(){
        return $this->hasMany(CntrlRiskCov::class);
    }
    public function layer(){    
        return $this->belongsTo(Layer::class);
    }

    public function remediations(){    
        return $this->hasManyTo(Remediation::class);
    }

    
}
