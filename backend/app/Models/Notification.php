<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Notification   extends Model
{
    public function notificationUsers(): HasMany
{
    return $this->hasMany(NotificationUser::class);
}

}
