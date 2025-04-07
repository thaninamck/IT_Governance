<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use App\Services\RecaptchaService;
class AuthControllerTest extends TestCase
{
    use RefreshDatabase;
    public function setUp(): void
    {
        parent::setUp();

        // Simuler le service reCAPTCHA pour qu'il retourne toujours "true"
        $this->mock(RecaptchaService::class, function ($mock) {
            $mock->shouldReceive('verify')->andReturn(true);
        });
    }

    #[Test]
    public function it_requires_email_and_password_to_login()
    {
        $this->postJson('/api/login', [])
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Validation of data failed',
                'data' => [
                    'email' => ['The email field is required.'],
                    'password' => ['The password field is required.'],
                    'captchaValue' => ['The captcha value field is required.'],
                ],
            ]);
    }


    
    
    
    
    
    
    
    
    
    
    
    #[Test]
    public function it_logs_in_a_user_with_valid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
            'captchaValue' => 'fake-value'
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
                'grade',
                'role',
                'lastActivity',
                'isActive',
                'createdAt',
            ],
            'must_change_password'
        ]);
        
    }


    #[Test]
    public function it_fails_to_login_with_invalid_credentials()
{
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
        'captchaValue' => 'fake-value'
    ])
    ->assertStatus(401) 
    ->assertJson([
        'success' => false,
        'message' => 'Incorrect data',
        
    ]);
}


    #[Test]
    public function test_it_logs_out_a_user()
{
    
    $user = User::factory()->create();

    //  Simuler une connexion
    $this->actingAs($user);

    //  Effectuer la requête de logout
    $response = $this->postJson('/api/logout');

    //  Debug pour voir la réponse API
    dump($response->json());

    //  Vérifier la réponse (structure flexible)
    $response->assertStatus(200)
             ->assertJsonFragment([
                 'Logged out successfully'
             ]);

    //  Vérifier que les tokens sont supprimés
    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id
    ]);
}


    



  
}
