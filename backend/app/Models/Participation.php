<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Participation extends Model
{
    use HasFactory;
    protected $fillable =['mission_id','user_id','profile_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }
    public function profile(){
        return $this->belongsTo(Profile::class);
    }
}
