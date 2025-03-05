<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function sendResponse($result, $message, $code = 200)
    {

        return response()->json($result, $code);
    }

    public function sendError($error, $errorMessage=[], $code = 400)
    {
        $response = [
            'success' => false,
            'message' => $error
        ];

        if(!empty($errorMessage)) {
            $response['data'] = $errorMessage;
        }
        return response()->json($response, $code);
    }
}
