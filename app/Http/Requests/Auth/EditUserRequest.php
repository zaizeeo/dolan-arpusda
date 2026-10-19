<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EditUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['email', 'nullable'],
            'name' => ['string', 'nullable'],
            'password' => ['string', 'min:8', 'max:32', 'nullable'],
            'role' => ['string', 'in:magang,staff,admin', 'nullable']
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.email' => 'Mohon isi email yang valid',
            'name.string' => 'Nama hanya bisa diisi text',
            'password.min' => 'Password minimal 8 karakter',
            'password.max' => 'Password maksimal 32 karakter',
            'role.string' => 'Pilih Role yang sesuai',
            'role.in' => 'Role hanya bisa diisi staff, admin, dan magang.'
        ];
    }
}
