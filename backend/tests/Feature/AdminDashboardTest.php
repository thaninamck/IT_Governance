<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Mission;
use App\Models\Status;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Log;
use Tests\TestCase;
use App\Services\calculations\AdminDashboardCalculator;

class AdminDashboardTest extends TestCase
{ use RefreshDatabase, WithFaker;
    
    /**
     * A basic feature test example.
     */
    public function test_integration_manager_report(): void
    {
        $client = Client::factory()->create(['commercial_name' => 'Air Algérie']);
        $status = Status::factory()->create([
            'status_name' => 'en_cours',
            'entity' => 'mission',
        ]);
        $mission = Mission::factory()->create([
            'client_id' => $client->id,
            'status_id' => $status->id,
            'mission_name' => 'Mission Intégration',
        ]);
       

        $calculator = app(AdminDashboardCalculator::class);
        $result = $calculator->calculate([]);
    
     Log::info('Admin Dashboard Result', ['result' => $result]);
        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Mission Intégration', $result[0]['missionName']);
        $this->assertEquals(100, $result[0]['controlNonCommencé']);
    }
}
