<?php

namespace App\Http\Requests\GuestBook;

use App\Models\GuestBookQuestion;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class CreateGuestBookRequest extends FormRequest
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
        $activeQuestionsCount = GuestBookQuestion::where('is_active', true)->count();

        return [
            'answers' => ['array', "min:$activeQuestionsCount", "max:$activeQuestionsCount"],
            'answers.*.guest_book_question_id' => ['string', 'required'],
            'answers.*.custom_text' => ['string', 'nullable'],
            'answers.*.guest_book_question_option_id' => ['string', 'nullable'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'answers.required' => 'Jawaban buku tamu wajib diisi.',
            'answers.array' => 'Format data jawaban tidak valid.',
            'answers.min' => 'Mohon lengkapi seluruh pertanyaan buku tamu.',
            'answers.max' => 'Jumlah jawaban tidak sesuai dengan pertanyaan yang tersedia.',
            'answers.*.guest_book_question_id.required' => 'Pertanyaan wajib dipilih.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $messages = $validator->errors()->toArray();
        $messages['server'] = [$validator->errors()->first()];

        throw ValidationException::withMessages($messages)
            ->redirectTo($this->getRedirectUrl());
    }
}
