<?php

namespace App\Http\Requests\Survey\Questions;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class CreateSurveyQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'options' => ['array', 'nullable'],
            'options.*.label' => ['required', 'string', 'min:2', 'max:255'],
            'options.*.description' => ['nullable', 'string', 'max:255'],
            'options.*.is_allow_custom_text' => ['nullable', 'boolean'],
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
            'label.required' => 'Label harus diisi',
            'label.string' => 'Label hanya bisa diisi dengan text',
            'label.min' => 'Label minimal 2 karakter',
            'label.max' => 'Label maksimal 255 karakter',
            'description.string' => 'Deskripsi hanya bisa diisi dengan text',
            'description.max' => 'Deskripsi maksimal 255 karakter',
            'options.*.label.required' => 'Label pilihan harus diisi',
            'options.*.label.string' => 'Label pilihan hanya bisa diisi dengan text',
            'options.*.label.min' => 'Label pilihan minimal 2 karakter',
            'options.*.label.max' => 'Label pilihan maksimal 255 karakter',
            'options.*.description.string' => 'Deskripsi hanya bisa diisi dengan text',
            'options.*.description.max' => 'Deskripsi maksimal 255 karakter',
            'options.*.is_allow_custom_text.boolean' => 'Opsi ini hanya bisa true atau false',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $messages = $validator->errors()->toArray();
        $messages['server'] = [$validator->errors()->first()];

        throw ValidationException::withMessages($messages)
            ->redirectTo($this->getRedirectUrl());
    }
}
