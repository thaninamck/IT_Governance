<?php


namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CustomNotification extends Notification
{
    use Queueable;
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function via($notifiable)
    {
        return ['database']; // Stocker en base de données
    }

    public function toDatabase($notifiable)
{
    return [
        'message' => $this->data['message'],
        'url' => $this->data['url'] ?? null, // Convertir en JSON
        'type' => $this->data['type'],
    ];
}
public function toArray($notifiable)
{
    return [
        'message' => $this->data['message'],
        'url' => $this->data['url'],
        'type' => $this->data['type'],
    ];
}

}
