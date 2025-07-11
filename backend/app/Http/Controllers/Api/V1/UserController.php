<?php

namespace App\Http\Controllers\Api\V1;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PositionsResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\V1\UserService;
use App\Services\LogService;

use App\Http\Resources\Api\V1\UserResource;
use Illuminate\Support\Facades\Hash;
use Log;


class UserController extends BaseController
{

    /**
     * Display a listing of the resource.
     */
    /**
     * @response TodoItemResource // 1 - PHPDoc
     */

    protected $userService;
    protected $logService;
    public function __construct(UserService $userService, LogService $logService)
    {
        $this->logService = $logService;
        $this->userService = $userService;
    }
    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        if ($users->isEmpty()) {
            return $this->sendError("No users found", []);
        }

        return $this->sendResponse(UserResource::collection($users), "Users retrieved successfully");
    }

    /**
     * Store a newly created resource in storage.
     */

     public function getGrades() {
        $grades = $this->userService->getGrades();  // Appel de la méthode pour récupérer les grades
    
        // Vérifier si des grades ont été récupérés
        if ($grades->isEmpty()) {
            return $this->sendError("No grades found", []); // Retourner une erreur si aucun grade n'est trouvé
        }
    
        // Retourner une réponse réussie avec les grades récupérés
        return $this->sendResponse($grades, "Grades retrieved successfully");
    }

    public function Grades() {
        $grades = $this->userService->getGrades();  // Appel de la méthode pour récupérer les grades
    
        // Vérifier si des grades ont été récupérés
        if ($grades->isEmpty()) {
            return $this->sendError("No grades found", []); // Retourner une erreur si aucun grade n'est trouvé
        }
    
        // Retourner une réponse réussie avec les grades récupérés
       // return $this->sendResponse($grades, "Grades retrieved successfully");
        return $this->sendResponse(PositionsResource::collection($grades),"grade retrived successfully");
    }
    
    public function createGrade(Request $request):JsonResponse
    {
        try{
            $rules = [
                'name' => 'required|string|max:255', 
            ];
    
            $validator =Validator::make($request->all(),$rules);

            if($validator->fails()){
                return $this->sendError("validation failed",$validator->errors(),422);
            }

            $gradeData=$validator->validated();

            $grade = $this->userService->createGrade($gradeData['name']);

            $this->logService->logUserAction(
                auth()->user()->email ??'Unknown',
                'Admin',
                "Création d'un grade de user {$grade->name}",
                "" 
            );
            $response=[
                'grade' =>new PositionsResource($grade),
                'message'=>' created successfully'
            ];
            return $this->sendResponse($response,"grade created successfully",201);
        }catch(\Exception $e){
            return $this->sendError("An error occured",["error"=>$e->getMessage()],500);
        }
    }

    public function deleteGrade($id):JsonResponse
    {
        try{
            $name =$this->userService->deleteGrade($id);
            if(!$name){
                return $this->sendError("type not found",[],404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'un grade de user:{$name}",
                " "
            );    
            return $this->sendResponse(['success'=>true],"grade deleted successfully");

        }catch(\Exception $e)
        {
            return $this->sendError("an erroe occured",['error'=>$e->getMessage()],500);
        }
    }
    public function store(Request $request): JsonResponse
    {
        try {
            $rules = [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'position_id' => 'nullable|integer|max:255',
                'phone_number' => 'nullable|string|max:255',
                'email' => 'required|email|unique:users',
                'role'=> 'sometimes|integer',
                'is_active'=> 'sometimes',
                'password' => [
                    'required',
                    
                ],
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return $this->sendError("Validation failed", $validator->errors(), 422);
            }

            $userData = $validator->validated();
            Log::info("user to create",$userData);

            $user = $this->userService->createUser($userData);

            $user->phone_number = $userData['phone_number'];
            if(!isset($userData['is_active'])){$user->is_active=$userData['is_active'];}else{ $user->is_active = true ;};
            if(!isset($userData['role'])){$user->role=$userData['role'];}else{ $user->role = 0 ;};

            $user->must_change_password = true;
            $user->last_activity = now();
            $user->last_password_change = null;
            $user->save();
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Création d'un utilisateur: {$user->email}",
                " "
            );
            $response = [
                'user' => new UserResource($user),
                'message' => 'user created successufly'
            ];
            return $this->sendResponse($response, "User created successfully", 201);
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ["error" => $e->getMessage()], 500);
        }
    }




    public function sayHello()
    {
        return response()->json([
            'message' => 'Hello World!'
        ])
        ;

    }



public function resetUser(Request $request, $id): JsonResponse
{
    try {
        // 🔹 Validation des données
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError("Validation error", $validator->errors(), 422);
        }

        $newPassword = Hash::make($request->input('new_password'));

        // 🔹 Appel du service avec le mot de passe validé
        $response = $this->userService->resetUser($id, $newPassword);

        if ($response) {
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Réinitialisation d'un utilisateur: {$response['email']}",
                " "
            );
            return $this->sendResponse([
                'message' => 'User reset successfully',
            ], "User reset successfully");
        } else {
            return $this->sendError("User not found or cannot be reset", [], 404);
        }
    } catch (\Exception $e) {
        return $this->sendError("An error occurred", ['error' => $e->getMessage()], 500);
    }
}





    public function updateUser(Request $request, $id): JsonResponse
    {
        $decodedRequest = json_decode($request->getContent(), true);
        $request->merge($decodedRequest);

        Log::info("Données après conversion :", $request->all());

        try {
            $rules = [
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'position_id' => 'sometimes|integer|max:25',
                'phone_number' => 'sometimes|string',
                'role' => 'sometimes|integer|in:0,1',
                'is_active' => 'sometimes|boolean'
            ];

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                Log::error("Erreur de validation :", $validator->errors()->toArray());

                return $this->sendError("Validation failed", $validator->errors());
            }
            Log::info("data validated", $validator->validated());

            $user = $this->userService->updateUser($id, $validator->validated());

            if (!$user) {
                return $this->sendError("User not found", [], 404);
            }
            $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Modification de l'utilisateur: {$user->email}",
                " "
            );
            return $this->sendResponse(new UserResource($user), "User updated successfully");

        } catch (\Exception $e) {
            return $this->sendError("An error occurred", $e->getMessage(), 500);
        }
    }

    public function blockUser($id): JsonResponse
    {
        try {
            $response = $this->userService->blockUser($id);

            if ($response) {
                $this->logService->logUserAction(
                    auth()->user()->email ?? 'Unknown',
                    'Admin',
                    "Blocage d'un utilisateur: {$response['email']}",
                    " "
                );
                return $this->sendResponse([
                    'message' => 'User blocked successfully',

                ], "User blocked successfully");
            } else {
                return $this->sendError("User not found or cannot be blocked", [], 404);
            }
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ['error' => $e->getMessage()], 500);
        }
    }


    public function unblockUser($id): JsonResponse
    {
        try {

            $response = $this->userService->unblockUser($id);

            if ($response) {
                $this->logService->logUserAction(
                    auth()->user()->email ?? 'Unknown',
                    'Admin',
                    "Déblocage d'un utilisateur: {$response['email']}",
                    " "
                );
                return $this->sendResponse(['message' => 'User unblocked successfully'], "User blocked successfully");
            } else {
                return $this->sendError("User not found or cannot be unblocked", [], 404);
            }
        } catch (\Exception $e) {
            return $this->sendError("An error occurred", ['error' => $e->getMessage()], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }


    /* public function getUserWithExecutionsAndParticipations($id)
     {
         try {
             $user = User::with('notifications')->find($id);
     
             if (!$user) {
                 return response()->json(['message' => 'Utilisateur non trouvé'], 404);
             }
     
             return response()->json($user);
         } catch (\Exception $e) {
             return response()->json([
                 'message' => 'Une erreur est survenue',
                 'error' => $e->getMessage()
             ], 500);
         }
     }*/

     public function deleteUser($id): JsonResponse
     {
         try {
             $email = $this->userService->deleteUser($id);
     
             if (!$email) {
                 return $this->sendError("Utilisateur non trouvé", [], 404);
             }
     
             $this->logService->logUserAction(
                auth()->user()->email ?? 'Unknown',
                'Admin',
                "Suppression  d'un utilisateur:{$email}",
                " "
            );     
             return $this->sendResponse(['success' => true], "Utilisateur supprimé avec succès.");
             
         } catch (\Exception $e) {
             return $this->sendError("Une erreur est survenue", ['error' => $e->getMessage()], 500);
         }
     }
     




    public function storeMultiple(Request $request): JsonResponse
    {
        $validUsers = $request->input('users', []);

        try {
            if (!empty($validUsers)) {

                $users = $this->userService->createMultipleUsers($validUsers);
                $this->logService->logUserAction(
                    auth()->user()->email ?? 'Unknown',
                    'Admin',
                    "Insertion d'utilisateurs",
                    " "
                );
                return $this->sendResponse([
                    'success' => true,
                    'message' => 'Users inserted successfully',
                    'inserted_users' => UserResource::collection($users),
                ], "Users were inserted successfully");
            }

            return $this->sendError("No users to insert", [], 422);
        } catch (\Exception $e) {
            // Attraper les erreurs et les envoyer avec un message détaillé
            return $this->sendError("Server error: " . $e->getMessage(), [], 500);
        }
    }



}
