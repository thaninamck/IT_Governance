<?php

namespace Database\Seeders;

use App\Models\StepTestScript;
use Illuminate\Database\Seeder;
use App\Models\Control;
use App\Models\Source;
use App\Models\Type;
use App\Models\MajorProcess;
use App\Models\SubProcess;

class ControlSeeder extends Seeder
{
    public function run(): void
    {
        if (!Source::exists()) {
            \Log::error("⚠️ La table sources est vide !");
            return; 
        }

        if (!Type::exists() || !MajorProcess::exists() || !SubProcess::exists()) {
            \Log::error("⚠️ Les tables Type, MajorProcess ou SubProcess sont vides !");
            return;
        }

        Control::factory()
            ->count(4)
            ->make() // on utilise make() pour pouvoir assigner les champs manuellement
            ->each(function ($control) {
                // On sélectionne des IDs existants aléatoires
                $control->type_id = Type::inRandomOrder()->first()->id;
                $control->major_id = MajorProcess::inRandomOrder()->first()->id;
                $control->sub_id = SubProcess::inRandomOrder()->first()->id;

                $control->save();

                // Ajouter des étapes de test
                for ($i = 1; $i <= rand(1, 4); $i++) {
                    StepTestScript::create([
                        'text' => "Étape $i du contrôle {$control->id}",
                        'control_id' => $control->id
                    ]);
                }

                // Attacher 1 à 2 sources
                $sources = Source::inRandomOrder()->limit(rand(1, 2))->pluck('id');
                $control->sources()->attach($sources);
            });

        \Log::info("✅ ControlSeeder a bien inséré des données avec type, major, sub et sources.");
    }
}
