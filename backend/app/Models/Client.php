<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;
    protected $fillable = [
        'commercial_name',
        'social_reason',
        'contact_1',
        'contact_2',
        'address',
        'correspondence',
        
        
    ];

    public function missions(){
        return $this->hasMany(Mission::class);
    }
}
