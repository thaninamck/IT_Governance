<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Status extends Model
{
    use HasFactory;
    protected $fillable=['status_name','entity'];

    public const STATUS_NON_COMMENCEE = 'non_commencee';
    public const STATUS_Annulée = 'annulée';
    
}
