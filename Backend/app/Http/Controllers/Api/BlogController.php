<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('user:id,name')->latest()->get();

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
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $data['user_id'] = $request->user()?->id;
        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog = Blog::create($data);

        $blog->load('user:id,name');

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    public function myBlogs(Request $request)
    {
        $blogs = Blog::with('user:id,name')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function show($id)
    {
        $blog = Blog::with('user:id,name')->findOrFail($id);

        return response()->json([
            'blog' => $blog
        ]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($blog->image && Storage::disk('public')->exists($blog->image)) {
                Storage::disk('public')->delete($blog->image);
            }

            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $blog->update($data);

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog->fresh()->load('user:id,name')
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::where('user_id', request()->user()->id)->findOrFail($id);

        if ($blog->image && Storage::disk('public')->exists($blog->image)) {
            Storage::disk('public')->delete($blog->image);
        }

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }
}
