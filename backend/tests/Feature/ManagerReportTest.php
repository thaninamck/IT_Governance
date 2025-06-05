<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Status;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Mission;
use App\Services\calculations\ManagerReportCalculator;
use Tests\TestCase;
use App\Repositories\V1\MissionRepository;
class ManagerReportTest extends TestCase
{
   
    use RefreshDatabase, WithFaker;
    
    /**
     * A basic feature test example.
     */
    public function test_integration_manager_report(): void
    {
        $client = Client::factory()->create(['commercial_name' => 'Air Algérie']);
        $status = Status::factory()->create([
            'status_name' => 'en cours',
            'entity' => 'mission',
        ]);
        $mission = Mission::factory()->create([
            'client_id' => $client->id,
            'status_id' => $status->id,
            'mission_name' => 'Mission Intégration',
        ]);
    
       
    
        // Appel réel du service
        $calculator = app(ManagerReportCalculator::class);
        $result = $calculator->calculate(['mission_id' => $mission->id]);
    
        // Vérifications
        $this->assertEquals('Mission Intégration', $result['mission_name']);
        $this->assertEquals($mission->id, $result['mission_id']);
        $this->assertIsArray($result['executions']);
        $this->assertEquals(0, $result['nbrControl']);

    }
    
}
