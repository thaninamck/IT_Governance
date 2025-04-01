<?php
namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Setting;
use Carbon\Carbon;

class UpdateMustChangePassword extends Command
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService) {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    protected $signature = 'app:update-must-change-password';
    protected $description = 'Met à jour must_change_password pour les utilisateurs dont le mot de passe est expiré et envoie des rappels';

    public function handle()
    {
        $passwordValidityDays = Setting::where('key', 'password_expiration_days')->value('value');

        if (!$passwordValidityDays) {
            $this->info('Aucune période de validité des mots de passe définie.');
            return;
        }

        $expirationDate = Carbon::now()->subDays($passwordValidityDays);
        $reminderDate = Carbon::now()->subDays($passwordValidityDays - 5); // 5 jours avant expiration

        // Mettre à jour les utilisateurs dont le mot de passe a expiré
        $usersToUpdate = User::where('last_password_change', '<=', $expirationDate)->get();
        foreach ($usersToUpdate as $user) {
            $user->update(['must_change_password' => true]);
            //$this->notificationService->sendNotification($user->id, "Votre mot de passe a expiré", ['type' => 'security'], "reminder");
        }

        // Envoyer une notification aux utilisateurs qui doivent changer leur mot de passe dans 5 jours
        $usersToRemind = User::where('last_password_change', '<=', $reminderDate)
            ->where('last_password_change', '>', $expirationDate)
            ->get();

        foreach ($usersToRemind as $user) {
            $this->notificationService->sendNotification($user->id, "Votre mot de passe expire dans 5 jours vous devez le changer", ['type' => 'security'], "reminder");
        }

        $this->info('Mise à jour et notifications terminées.');
    }
}
