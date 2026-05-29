<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $profile = $user->profile()->first();

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(ProfileRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();

        if ($request->hasFile('profile_pic')) {
            $path = Storage::disk('cloudinary')->putFile('avatars', $request->file('profile_pic'));

            $data['profile_pic'] = Storage::disk('cloudinary')->url($path);
        }

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
        ]);
    }
}
