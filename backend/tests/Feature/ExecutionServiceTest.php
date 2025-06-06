<?php

namespace Tests\Feature;

use App\Models\Control;
use App\Models\Layer;
use App\Models\Mission;
use App\Models\Risk;
use App\Models\System;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ExecutionServiceTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_create_executions_integration(): void
    {
        // Création des entités nécessaires
        $system = System::factory()->create();
        $layer = Layer::factory()->create(['system_id' => $system->id]);
        $controlTester = User::factory()->create();
        $controlOwner =User::factory()->create();
        $riskOwner = User::factory()->create();
        $control = Control::factory()->create();
        $risk = Risk::factory()->create();
        $mission = Mission::factory()->create();
    
        // Données d’exécution à insérer
        $executionData = [
            'executions' => [
                [
                    'controlModified' => true,
                    'controlDescription' => 'Description de test',
                    'controlId' => $control->id,
                    'controlTester' => $controlTester->id,
                    'controlOwner' => $controlOwner->id,
                    'layerId' => $layer->id,
                    'riskModified' => true,
                    'riskDescription' => 'Risque de test',
                    'riskId' => $risk->id,
                    'riskOwner' => $riskOwner->id,
                ],
            ],
        ];
    
        // Appel réel au service
        $executionService = app(\App\Services\V1\ExecutionService::class);
        $execution = $executionService->createExecutions($executionData);
    
        // Vérifications
        $this->assertDatabaseHas('executions', [
            'id' => $execution->id,
           
            'user_id' => $controlTester->id,
        ]);
    
        $this->assertDatabaseHas('cntrl_risk_covs', [
            'execution_id' => $execution->id,
            'risk_id' => $risk->id,
            'risk_owner' => $riskOwner->id,
        ]);
    }
    
    public function test_create_execution_with_unmodified_control_and_modified_risk(): void
{
    $system = System::factory()->create();
    $layer = Layer::factory()->create(['system_id' => $system->id]);
    $controlTester = User::factory()->create();
    $controlOwner = User::factory()->create();
    $riskOwner = User::factory()->create();
    $control = Control::factory()->create();
    $risk = Risk::factory()->create();
    $mission = Mission::factory()->create();

    $executionData = [
        'executions' => [
            [
                'controlModified' => false,
                'controlDescription' => 'à ignorer',
                'controlId' => $control->id,
                'controlTester' => $controlTester->id,
                'controlOwner' => $controlOwner->id,
                'layerId' => $layer->id,
                'riskModified' => true,
                'riskDescription' => 'Risque nouveau',
                'riskId' => $risk->id,
                'riskOwner' => $riskOwner->id,
            ],
        ],
    ];

    $executionService = app(\App\Services\V1\ExecutionService::class);
    $execution = $executionService->createExecutions($executionData);

    $this->assertDatabaseHas('executions', ['id' => $execution->id]);
    $this->assertDatabaseHas('cntrl_risk_covs', [
        'execution_id' => $execution->id,
        'risk_id' => $risk->id,
        'risk_owner' => $riskOwner->id,
        'risk_modification' => 'Risque nouveau',
    ]);
}


public function test_create_execution_with_no_modifications(): void
{
    $system = System::factory()->create();
    $layer = Layer::factory()->create(['system_id' => $system->id]);
    $controlTester = User::factory()->create();
    $controlOwner = User::factory()->create();
    $riskOwner = User::factory()->create();
    $control = Control::factory()->create();
    $risk = Risk::factory()->create();
    $mission = Mission::factory()->create();
    $executionData = [
        'executions' => [
            [
                'controlModified' => false,
                'controlDescription' => 'à ignorer',
                'controlId' => $control->id,
                'controlTester' => $controlTester->id,
                'controlOwner' => $controlOwner->id,
                'layerId' => $layer->id,
                'riskModified' => false,
                'riskDescription' => 'à ignorer',
                'riskId' => $risk->id,
                'riskOwner' => $riskOwner->id,
            ],
        ],
    ];
    $executionService = app(\App\Services\V1\ExecutionService::class);

    $execution = $executionService->createExecutions($executionData);

    $this->assertDatabaseHas('executions', [
        'id' => $execution->id,
        'cntrl_modification' => null,
    ]);

    $this->assertDatabaseHas('cntrl_risk_covs', [
        'execution_id' => $execution->id,
        'risk_modification' => null,
    ]);
}


}
