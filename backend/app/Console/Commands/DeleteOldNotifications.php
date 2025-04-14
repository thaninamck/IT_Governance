<?php

namespace App\Console\Commands;

use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteOldNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-old-notifications';

    /**
     * The console command description.
     *
     * @var string
     */

    /**
     * Execute the console command.
     */
    

    protected $description = 'Supprime les notifications lues (>30j) et non lues (>40j)';

    public function handle()
    {
        $cutoffRead = Carbon::now()->subDays(30);
        $cutoffUnread = Carbon::now()->subDays(40);

        
        $deletedRead = Notification::whereNotNull('read_at')
            ->where('created_at', '<', $cutoffRead)
            ->delete();

        $deletedUnread = Notification::whereNull('read_at')
            ->where('created_at', '<', $cutoffUnread)
            ->delete();

        $this->info("Notifications supprimées :");
        $this->line(" Lues (>30j) : $deletedRead");
        $this->line(" Non lues (>40j) : $deletedUnread");
}
}