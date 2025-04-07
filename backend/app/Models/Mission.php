<?php

namespace App\Models;
use App\Models\client;
use App\Models\status;

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
        'audit_start_date',
        'audit_end_date' 
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
        return $this->hasMany(System::class);

    }
}
