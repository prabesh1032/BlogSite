<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Cache::remember('blogs:list', 30, function () {
            return Blog::with(['user' => function ($q) {
                $q->select('id', 'name');
                $q->with(['profile' => function ($q2) {
                    $q2->select('id', 'user_id', 'profile_pic');
                }]);
            }])->latest()->get(['id', 'user_id', 'title', 'category', 'slug', 'image', 'created_at']);
        });

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $disk = env('CLOUDINARY_API_KEY') && env('CLOUDINARY_CLOUD_NAME') ? 'cloudinary' : 'public';

            if ($disk === 'cloudinary') {
                try {
                    $result = Storage::disk('cloudinary')->putFile('blogs', $request->file('image'));

                    // Adapter may return a string path or an array with urls. Handle both.
                    if (is_string($result)) {
                        $data['image'] = Storage::disk('cloudinary')->url($result);
                    } elseif (is_array($result)) {
                        // common Cloudinary SDK keys
                        $data['image'] = $result['secure_url'] ?? $result['url'] ?? (string) ($result['public_id'] ?? '');
                    } else {
                        // Fallback: attempt to cast to string or use local storage
                        $data['image'] = (string) $result ?: $request->file('image')->store('blogs', 'public');
                    }
                } catch (\Throwable $e) {
                    // If Cloudinary fails, fallback to local storage to avoid blocking the request
                    $data['image'] = $request->file('image')->store('blogs', 'public');
                }
            } else {
                $data['image'] = $request->file('image')->store('blogs', 'public');
            }
        }

        $data['user_id'] = $request->user()?->id;
        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog = Blog::create($data);

        // Invalidate blogs list cache
        Cache::forget('blogs:list');

        $blog->load('user.profile');

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    public function myBlogs(Request $request)
    {
        $blogs = Blog::with('user.profile')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function show($blog)
    {
        $blog = Blog::with('user.profile')
            ->where('slug', $blog)
            ->orWhere('id', $blog)
            ->firstOrFail();

        return response()->json([
            'blog' => $blog
        ]);
    }

    public function update(Request $request, $blog)
    {
        $blog = Blog::where('user_id', $request->user()->id)
            ->where(function ($query) use ($blog) {
                $query->where('slug', $blog)->orWhere('id', $blog);
            })
            ->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $disk = env('CLOUDINARY_API_KEY') && env('CLOUDINARY_CLOUD_NAME') ? 'cloudinary' : 'public';

            if ($disk === 'cloudinary') {
                try {
                    $result = Storage::disk('cloudinary')->putFile('blogs', $request->file('image'));

                    if (is_string($result)) {
                        $data['image'] = Storage::disk('cloudinary')->url($result);
                    } elseif (is_array($result)) {
                        $data['image'] = $result['secure_url'] ?? $result['url'] ?? (string) ($result['public_id'] ?? '');
                    } else {
                        $data['image'] = (string) $result ?: $request->file('image')->store('blogs', 'public');
                    }
                } catch (\Throwable $e) {
                    $data['image'] = $request->file('image')->store('blogs', 'public');
                }
            } else {
                if ($blog->image && Storage::disk('public')->exists($blog->image)) {
                    Storage::disk('public')->delete($blog->image);
                }

                $data['image'] = $request->file('image')->store('blogs', 'public');
            }
        }

        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog->update($data);

        // Invalidate blogs list cache
        Cache::forget('blogs:list');

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog->fresh()->load('user.profile')
        ]);
    }

    public function destroy($blog)
    {
        $blog = Blog::where('user_id', request()->user()->id)
            ->where(function ($query) use ($blog) {
                $query->where('slug', $blog)->orWhere('id', $blog);
            })
            ->firstOrFail();

        // Delete local image only if stored on public disk. Cloudinary images are left (optional cleanup).
        if ($blog->image && Storage::disk('public')->exists($blog->image)) {
            Storage::disk('public')->delete($blog->image);
        }

        $blog->delete();

        // Invalidate blogs list cache
        Cache::forget('blogs:list');

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }
}
