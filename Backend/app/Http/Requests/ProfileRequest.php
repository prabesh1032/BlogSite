<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => 'nullable|string|max:40',
            'bio' => 'nullable|string|max:100',
            'profile_pic' => 'nullable|image|max:2048',
        ];
    }
}
