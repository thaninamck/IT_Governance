<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
Schedule::command('app:update-must-change-password')->dailyAt(rand(0, 1) . ':'. rand(0, 59));
Schedule::command('app:delete-old-notifications')->dailyAt('02:30');
Schedule::command('missions:update-statuses')->dailyAt('00:00');
