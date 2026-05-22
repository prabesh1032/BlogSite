<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

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
            $disk = env('CLOUDINARY_API_KEY') && env('CLOUDINARY_CLOUD_NAME') ? 'cloudinary' : 'public';

            if ($disk === 'cloudinary') {
                try {
                    $result = Storage::disk('cloudinary')->putFile('avatars', $request->file('profile_pic'));

                    if (is_string($result)) {
                        $data['profile_pic'] = Storage::disk('cloudinary')->url($result);
                    } elseif (is_array($result)) {
                        $data['profile_pic'] = $result['secure_url'] ?? $result['url'] ?? (string) ($result['public_id'] ?? '');
                    } else {
                        $data['profile_pic'] = (string) $result ?: $request->file('profile_pic')->store('avatars', 'public');
                    }
                } catch (\Throwable $e) {
                    $path = $request->file('profile_pic')->store('avatars', 'public');
                    $data['profile_pic'] = $path;
                }
            } else {
                $path = $request->file('profile_pic')->store('avatars', 'public');
                $data['profile_pic'] = $path;
            }
        }

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile updated',
            'profile' => $profile,
        ]);
    }
}
