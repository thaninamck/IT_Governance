<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class MajorProcess extends Model
{
    use HasFactory;
    protected $fillable=['code','description'];
    public function controls()
    {
        return $this->hasMany(Control::class);
    }

  

    
}
