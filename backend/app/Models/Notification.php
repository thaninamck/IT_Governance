<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\DatabaseNotification;
class Notification   extends DatabaseNotification
{
    protected $fillable = ['id', 'type', 'notifiable_type', 'notifiable_id', 'data', 'read_at'];
   
    
        protected $casts = [
            'data' => 'array', // Convertir automatiquement JSON en tableau PHP
            'read_at' => 'datetime',
        ];
    

}
