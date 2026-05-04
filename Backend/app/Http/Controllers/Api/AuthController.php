<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function Login(LoginRequest $request)
    {
        $data = $request->validated();
        if (!Auth ::attempt($data)) {
            return response([
                'message' => 'Provided credentials are incorrect'
            ], 401);
        }
        /** @var  User $user */
        $user = Auth::user();
       $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
    public function Signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var  User $user */
        $user = User::create ([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
        /** @var  User $user */
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));


    }
    public function Logout(Request $request)
    {
        /** @var  User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response([
            'message' => 'Logged out'
        ]);

    }



}
