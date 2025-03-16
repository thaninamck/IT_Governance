<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Layer extends Model
{
    use HasFactory;
    protected $fillable = [
        "name","system_id"
    ];

    public function system(){
        return $this->belongsTo(System::class);
    }

    public function layers(){
        return $this->hasMany(Layer::class);
    }
}
