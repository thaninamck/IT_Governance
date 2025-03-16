<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class System extends Model
{
    use HasFactory;
    protected $fillable=[
        "name","description", "owner_id"
    ];
    public function layers(){
        return $this->hasMany(Layer::class);
    }
}
