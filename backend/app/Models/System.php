<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class System extends Model
{
    use HasFactory;
    protected $fillable=[
        "name","description", "owner_id"
    ];
    public function layers(){
        return $this->hasMany(Layer::class);
    }

    public function missions(){
        return $this->belongsToMany(Mission::class, 'mission_systems', 'system_id', 'mission_id');

    }


    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }

}
