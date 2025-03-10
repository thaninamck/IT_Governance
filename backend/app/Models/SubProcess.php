<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubProcess extends Model
{
    use HasFactory;
    protected $fillable=['name','code'];
    public function controls()
    {
        return $this->hasMany(Control::class);
    }
}
