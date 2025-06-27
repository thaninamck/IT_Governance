<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Source;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources=['ITGC', 'RNSI','ISO27001', 'ISO27002'];
       foreach ($sources as $source) {
        Source::firstOrCreate(['source_name' => $source]);
       }
    }
}
