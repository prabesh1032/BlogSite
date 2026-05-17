<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest()->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
        ]);

        $user = $request->user();

        $blog = Blog::create([
            'user_id' => $user?->id,
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'image' => $request->image,
            'slug' => Str::slug($request->title),
        ]);

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    public function myBlogs(Request $request)
    {
        $blogs = Blog::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'blogs' => $blogs
        ]);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);

        return response()->json([
            'blog' => $blog
        ]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
        ]);

        $blog->update([
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'image' => $request->image,
            'slug' => Str::slug($request->title),
        ]);

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::where('user_id', request()->user()->id)->findOrFail($id);

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }
}
