<?php

namespace App\Models;
use App\Models\clients;
use App\Models\statuses;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
}
