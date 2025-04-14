<?php

namespace App\Providers;

use App\Models\Mission;
use App\Observers\MissionObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
       // Mission::observe(MissionObserver::class);
    }
}
