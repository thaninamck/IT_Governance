<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class System extends Model
{
    use HasFactory;
    protected $fillable=[
        "name","description", "owner_id","mission_id"
    ];
    public function layers(){
        return $this->hasMany(Layer::class);
    }
    public function missions(){
        return $this->belongsTo(Mission::class);

    }
    public function mission(){
        return $this->belongsTo(Mission::class);

    }
    
    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }
}
