<?php

namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\Api\V1\UserResource;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Services\RecaptchaService;
use Illuminate\Support\Facades\Validator;
use Log;
class AuthController extends BaseController
{

    protected $recaptchaService;

    public function __construct(RecaptchaService $recaptchaService)
    {
        $this->recaptchaService = $recaptchaService;
    }
    public function login(Request $request)
    {
        try {
            $settings = Setting::pluck('value', 'key')->toArray();

            $rules = [
                'email' => 'required|email',
                'password' => 'required',
                // 'captchaValue' => 'required'
            ];

            if (isset($settings['password_min_length'])) {
                $rules['password'] .= '|min:' . $settings['password_min_length'];
            }

            if (isset($settings['password_max_length'])) {
                $rules['password'] .= '|max:' . $settings['password_max_length'];
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation of data failed", $validator->errors());
            }

            // $recaptchaData = $this->recaptchaService->verify($request);
            // if (!$recaptchaData) {
            // return $this->sendError("Recaptcha verification failed", ["recaptcha" => ["Invalid reCAPTCHA response"]]);
            // }

            $user = User::where('email', $request->email)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->sendError("Incorrect data", ["password" => ["No user found with the specified data"]]);
            }

            $user->update(["last_activity" => now()]);

            // 🔹 Générer un token d'accès (Access Token)
            $accessToken = $user->createToken($user->first_name)->plainTextToken;

            return $this->sendResponse([
                'token' => $accessToken,
                'user' => new UserResource($user),
                'must_change_password' => $user->must_change_password
            ], 'Logged in successfully!');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }





    public function logout(Request $request)
    {
        Log::info('Token reçu:', ['token' => request()->header('Authorization')]);

        $user = $request->user();

        $request->user()->tokens()->delete();

        return $this->sendResponse('Logged out successfully', 'Logged out successfully');
    }




    public function forceUpdatePassword(Request $request)
    {
        $user = auth()->user();

        $rules = [
            'new_password' => [
                'required',
                'string',
                'min:12',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%_*?&]{12,}$/'
            ],
        ];

        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation of data failed", $validator->errors(), 422);
        }
        // Mise à jour du mot de passe
        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
        ]);

        $user->tokens()->delete();

        // Retourner une réponse
        return $this->sendResponse('Password updated successfully. Please log in again.', 'Password updated successfully. Please log in again.');
    }


    public function checkEmailExists(Request $request)
    {
        $rules = [
            'email' => 'required|email|exists:users,email',
        ];
        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Aucun utilisateur trouvé avec cette addresse veuillez introduire une addresse valide", $validator->errors(), 422);
        }
        $result = [
            'success' => true,
            'message' => 'Email exists. Frontend can now send the code.'
        ];
        return $this->sendResponse($result, 'Email exists. Frontend can now send the code.');
    }



    public function storeResetCode(Request $request)
    {
        try {
            // Validation des entrées
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'code' => 'required|digits:4',
            ]);

            DB::beginTransaction(); // Démarrer une transaction

            // Supprimer d'anciens codes pour cet email
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            // Insérer le nouveau code
            DB::table('password_reset_tokens')->insert([
                'email' => $request->email,
                'token' => $request->code,
                'created_at' => Carbon::now(),
            ]);

            DB::commit(); // Valider la transaction

            return $this->sendResponse(['Reset code stored successfully.'], 'Reset code stored successfully.');
        } catch (\Throwable $th) {
            DB::rollBack(); // Annuler la transaction en cas d'erreur
            return $this->sendError('An error occurred while storing the reset code.', ['error' => $th->getMessage()], 500);
        }
    }




    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|digits:4',
        ]);

        $exists = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5)) // Expiration 5 min
            ->exists();

        if (!$exists) {
            return $this->sendError('Code expiré ou invalide', []);
        }
        // Supprimer le code après utilisation
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return $this->sendResponse(['Code verified successfully.'], 'Code verified successfully.');
    }



    public function resetPassword(Request $request)
    {

        $rules = [
            'email' => 'required|email|exists:users,email',
            
            'new_password' => [
                'required',
                'string',
                'min:12',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%_*?&]{12,}$/'
            ],
        ];

        // Validation des données
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->sendError("Validation of data failed", $validator->errors(), 422);
        }

       

        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);


        return $this->sendResponse(['Password reset successfully. Please log in again.'], 'Password reset successfully. Please log in again.');
    }


}
