<?php

namespace App\Console\Commands;

use App\Models\Mission;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateMissionStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'missions:update-statuses';
    protected $description = 'Update mission statuses based on current date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // \Log::info('Début de la mise à jour des statuts des missions...');
        
        // $currentDate = Carbon::now();
        // \Log::info("Date actuelle: ".$currentDate);
        
        // // Missions non commencées
        // Mission::where('start_date', '>', $currentDate)
        //     ->where('status_id', '!=', 7)
        //     ->update(['status_id' => 7]);
        //     \Log::info("Missions non commencées mises à jour: ");
        
        // // Missions en cours
        // Mission::where('start_date', '<=', $currentDate)
        //     ->where('end_date', '>=', $currentDate)
        //     ->where('status_id', '!=', 8)
        //     ->update(['status_id' => 8]);
        //     \Log::info("Missions en cours mises à jour: ");
        
        // // Missions en retard
        // Mission::where('end_date', '<', $currentDate)
        //     ->where('status_id', '!=', 9)
        //     ->update(['status_id' => 9]);
        //     \Log::info("Missions en retard mises à jour: ");
        
        // $this->info("Mise à jour terminée.");
        
        // return 0;
    }
}
