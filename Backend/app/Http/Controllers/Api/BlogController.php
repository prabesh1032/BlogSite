<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 0);
        $offset = (int) $request->query('offset', 0);
        $offset = $offset < 0 ? 0 : $offset;

        $query = Blog::with('user.profile')->latest();

        if ($offset > 0) {
            $query->skip($offset);
        }

        if ($limit > 0) {
            $query->take($limit);
        }

        $blogs = $query->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function search(Request $request)
    {
        $query = trim($request->query('q', ''));
        $limit = (int) $request->query('limit', 0);
        $offset = (int) $request->query('offset', 0);
        $offset = $offset < 0 ? 0 : $offset;

        if ($query === '') {
            return response()->json([
                'blogs' => []
            ]);
        }

        $searchQuery = Blog::with('user.profile')
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('category', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->latest();

        if ($offset > 0) {
            $searchQuery->skip($offset);
        }

        if ($limit > 0) {
            $searchQuery->take($limit);
        }

        $blogs = $searchQuery->get();

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
            $path = Storage::disk('cloudinary')->putFile('blogs', $request->file('image'));
            $data['image'] = Storage::disk('cloudinary')->url($path);
        }

        $data['user_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog = Blog::create($data);

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog->load('user.profile')
        ], 201);
    }

    public function myBlogs(Request $request)
    {
        $limit = (int) $request->query('limit', 0);
        $offset = (int) $request->query('offset', 0);
        $offset = $offset < 0 ? 0 : $offset;

        $query = Blog::with('user.profile')
            ->where('user_id', $request->user()->id)
            ->latest();

        if ($offset > 0) {
            $query->skip($offset);
        }

        if ($limit > 0) {
            $query->take($limit);
        }

        $blogs = $query->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function show($blog)
    {
        $query = Blog::with('user.profile');

        if (is_numeric($blog)) {
            $query->where('id', $blog);
        } else {
            $query->where('slug', $blog);
        }

        $blog = $query->firstOrFail();

        return response()->json([
            'blog' => $blog
        ]);
    }

    public function update(Request $request, $blog)
    {
        $query = Blog::where('user_id', $request->user()->id);

        if (is_numeric($blog)) {
            $query->where('id', $blog);
        } else {
            $query->where('slug', $blog);
        }

        $blog = $query->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = Storage::disk('cloudinary')->putFile('blogs', $request->file('image'));
            $data['image'] = Storage::disk('cloudinary')->url($path);
        }

        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog->update($data);

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog->fresh()->load('user.profile')
        ]);
    }

    public function destroy($blog)
    {
        $query = Blog::where('user_id', request()->user()->id);

        if (is_numeric($blog)) {
            $query->where('id', $blog);
        } else {
            $query->where('slug', $blog);
        }

        $blog = $query->firstOrFail();

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }
}
