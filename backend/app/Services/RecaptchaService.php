<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    protected $secretKey;

    public function __construct()
    {
        $this->secretKey = env('RECAPTCHA_SECRET');
    }

    public function verify(Request $request)
    {
        $recaptchaResponse = $request->input('captchaValue');

        if (!$recaptchaResponse) {
            return false;
        }

        $verify = Http::withoutVerifying()->asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => $this->secretKey,
            'response' => $recaptchaResponse,
            'remoteip' => $request->ip(),
        ]);

        $recaptchaData = $verify->json();

        Log::info('reCAPTCHA Response:', $recaptchaData);

        return $recaptchaData['success'] ?? false;
    }
}
