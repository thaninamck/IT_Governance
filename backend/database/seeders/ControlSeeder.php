<?php


namespace Database\Seeders;

use App\Models\StepTestScript;
use Illuminate\Database\Seeder;
use App\Models\Control;
use App\Models\Source;

class ControlSeeder extends Seeder
{
    public function run(): void
    {
        if (!Source::exists()) {
            \Log::error("⚠️ La table sources est vide !");
            return; 
        }

        Control::factory()
            ->count(300)
            ->create()
            ->each(function (Control $control) {
                for ($i = 1; $i <= rand(1, 4); $i++) {
                    StepTestScript::create([
                        'text' => "Étape $i du contrôle {$control->id}",
                        'control_id' => $control->id
                    ]);
                }
            })
            ->each(function ($control) {
                $sources = Source::inRandomOrder()->limit(rand(1, 2))->pluck('id');
                $control->sources()->attach($sources);
            });
           

        \Log::info(" ControlSeeder a bien inséré des données avec sources.");
    }
}
