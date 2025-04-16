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
        //'control_id',
        'status_id',
       
        'layer_id'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // public function control()
    // {
    //     return $this->belongsTo(Control::class);
    // }
    public function coverage(){
        return $this->hasMany(CntrlRiskCov::class);
    }
    public function layer(){    
        return $this->belongsTo(Layer::class);
    }

    // public function remediations(){    
    //     return $this->hasManyTo(Remediation::class);
    // }
    public function remediations(){    
        return $this->hasMany(Remediation::class);
    }

    public function evidences(){    
        return $this->hasManyTo(Evidence::class);
    }
    
    public function steps()
    {
        return $this->belongsToMany(StepTestScript::class, 'step_executions', 'execution_id', 'step_id');
    }

//     public function control()
// {
//     return $this->hasOneThrough(
//        Control::class,
//        StepTestScript::class,
//         'id',               // Foreign key on StepTestScript
//         'id',               // Foreign key on Control
//         'id',               // Local key on Execution
//         'control_id'        // Local key on StepTestScript
//     );
// }

public function step()
{
    return $this->hasOne(StepTestScript::class, 'id', 'step_id')->with('control');
}

}
