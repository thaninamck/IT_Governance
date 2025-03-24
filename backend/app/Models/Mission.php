<?php

namespace App\Models;
use App\Models\clients;
use App\Models\statuses;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mission extends Model
{ use HasFactory;
    protected $fillable = [
        'status_id',
        'mission_name',
        'client_id',
        'start_date',
        'end_date',
    ];

    protected $dates = ['start_date', 'end_date'];

    // Relation avec le modèle Client
    public function client() {
        return $this->belongsTo(Client::class, 'client_id');
    }

    // Relation avec le modèle Status
    public function status() {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class);
    }
    public function executions(): HasMany
    {
        return $this->hasMany(Execution::class);
    }
   

    public function remediations(): HasMany
    {
        return $this->hasMany(Remediation::class);
    }

    public function systems(){
        return $this->belongsToMany(System::class,'mission_systems','mission_id','system_id');

    }
}
