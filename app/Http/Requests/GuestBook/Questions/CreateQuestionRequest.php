<?php

namespace App\Http\Requests\GuestBook\Questions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class CreateQuestionRequest extends FormRequest
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
            'label' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'options' => ['array', 'nullable'],
            'options.*.label' => ['string', 'min:2'],
            'options.*.description' => ['string', 'nullable']
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
            'label.required' => 'Label Harus diisi',
            'label.string' => 'Label hanya bisa diisi dengan text',
            'text.string' => 'Label hanya bisa diisi dengan text',
            'options.*.label.required' => 'Label Harus diisi',
            'options.*.label.string' => 'Label hanya bisa diisi dengan text',
            'options.*.description.string' => 'Deskripsi hanya bisa diisi dengan text',
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

    public function createQuestion() {}
}
