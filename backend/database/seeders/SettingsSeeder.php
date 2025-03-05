<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;
class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'password_min_length', 'value' => '12'],
            ['key' => 'password_max_length', 'value' => '20'],
            ['key' => 'password_expiration_days', 'value' => '60'],
            ['key' => 'password_expiration_warning_days', 'value' => '7'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], ['value' => $setting['value']]);
        }
    }
}
